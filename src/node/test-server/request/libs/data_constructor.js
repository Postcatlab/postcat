(() => {
  'use strict';
  /**
   * @name 信息构造器类
   * @author Postcat
   */
  class main {
    constructor() {
      this.DEFAULT_REFS_FROM_EO_TYPE = {
        8: 'false',
        12: '[]',
        13: '{}',
        14: '0',
        15: 'null'
      };
    }
    /**
     * @desc eolinker自定义格式转换为json
     * @param {array} input_eo_original_arr 原始 eo 定义队列
     * @param {object} input_parent_obj 父对象
     * @param {object} input_opts 可选配置项 {needToParseBindData:是否特殊解析定义字符串,isXml:组装内容是否为xml,bindObj:绑定对象,fnSetXmlAttr:xml属性处理函数}
     * @param {object} input_xml_attr_parent_obj 可选配置项，当且仅当构造对象为xml时生效，为xml父属性继承对象
     * @return {object} json字符串
     *
     */
    eo_define_arr_to_json(input_eo_original_arr, input_parent_obj = {}, input_opts = {}, input_xml_attr_parent_obj = {}) {
      let vm = this;
      input_eo_original_arr.map(function (val) {
        if (!val.paramKey || !val.checkbox) {
          return;
        }
        try {
          if (input_opts.needToParseBindData) {
            val.paramKey = vm.construct_text_by_express_builder(vm.replace_text_from_bind_obj(val.paramKey, input_opts.bindObj));
            val.paramInfo = vm.construct_text_by_express_builder(
              vm.replace_text_from_bind_obj(val.paramInfo || val.paramValue || '', input_opts.bindObj)
            );
            if (input_opts.isXml)
              val.attribute = vm.construct_text_by_express_builder(vm.replace_text_from_bind_obj(val.attribute || '', input_opts.bindObj));
          } else {
            val.paramKey = vm.construct_text_by_express_builder(val.paramKey);
            val.paramInfo = vm.construct_text_by_express_builder(val.paramInfo || val.paramValue || '');
            if (input_opts.isXml) val.attribute = vm.construct_text_by_express_builder(val.attribute || '');
          }
        } catch (BIND_PARSE_ERROR) {}
        let tmp_value = (input_parent_obj[val.paramKey] = val.paramInfo || val.paramValue || '');
        if (input_opts.isXml) input_xml_attr_parent_obj[val.paramKey] = val.attribute || '';
        if (val.childList && val.childList.length > 0) {
          if (input_opts.isXml) input_xml_attr_parent_obj[val.paramKey] = [input_xml_attr_parent_obj[val.paramKey], {}];
          let tmp_cb_result;
          switch (val.paramType.toString()) {
            case '12': {
              //array
              if ((val.childList[0] || {}).isArrItem) {
                //新数据结构，多项值数组
                input_parent_obj[val.paramKey] = [];
                tmp_cb_result = { has_text: true }; //设置tmp_cb_result，用于确认当前数组已经有内容，无需重新json_parse
                val.childList.map((tmp_child_item, tmp_child_key) => {
                  if (!tmp_child_item.checkbox) return;
                  let tmp_item_parent_obj = {},
                    tmp_item_xml_attr_parent_obj = {};
                  if (tmp_child_item.paramType.toString() === '12' || !(tmp_child_item.childList && tmp_child_item.childList.length > 0)) {
                    vm.eo_define_arr_to_json(
                      [tmp_child_item],
                      tmp_item_parent_obj,
                      input_opts,
                      input_opts.isXml ? tmp_item_xml_attr_parent_obj : {}
                    );
                    tmp_item_parent_obj = tmp_item_parent_obj[tmp_child_item.paramKey];
                    tmp_item_xml_attr_parent_obj = tmp_item_xml_attr_parent_obj[tmp_child_item.paramKey];
                  } else {
                    vm.eo_define_arr_to_json(
                      tmp_child_item.childList,
                      tmp_item_parent_obj,
                      input_opts,
                      input_opts.isXml ? tmp_item_xml_attr_parent_obj : {}
                    );
                  }
                  input_parent_obj[val.paramKey].push(tmp_item_parent_obj);
                  if (input_opts.isXml) {
                    if (typeof input_xml_attr_parent_obj[val.paramKey][0] !== 'object') input_xml_attr_parent_obj[val.paramKey][0] = [];
                    input_xml_attr_parent_obj[val.paramKey][0].push(tmp_child_item.attribute || '');
                    input_xml_attr_parent_obj[val.paramKey].splice(tmp_child_key + 1, 1, tmp_item_xml_attr_parent_obj);
                  }
                });
              } else {
                //为老数据，第一项数值不存在字段isArrItem
                input_parent_obj[val.paramKey] = [{}];
                tmp_cb_result = vm.eo_define_arr_to_json(
                  val.childList,
                  input_parent_obj[val.paramKey][0],
                  input_opts,
                  input_opts.isXml ? input_xml_attr_parent_obj[val.paramKey][1] : {}
                );
              }
              break;
            }
            default: {
              input_parent_obj[val.paramKey] = {};
              tmp_cb_result = vm.eo_define_arr_to_json(
                val.childList,
                input_parent_obj[val.paramKey],
                input_opts,
                input_opts.isXml ? input_xml_attr_parent_obj[val.paramKey][1] : {}
              );
              break;
            }
          }
          if (vm.check_empty_obj(tmp_cb_result)) {
            try {
              input_parent_obj[val.paramKey] = JSON.parse(tmp_value);
            } catch (JSON_PARSE_ERROR) {
              input_parent_obj[val.paramKey] = tmp_value;
            }
          }
        } else {
          let tmp_param_type = val.paramType.toString();
          switch (tmp_param_type) {
            case '0': {
              //字符串
              break;
            }
            case '15': {
              //null
              input_parent_obj[val.paramKey] = null;
            }
            case '14': {
              //number
              let tmp_num_text = input_parent_obj[val.paramKey] || vm.DEFAULT_REFS_FROM_EO_TYPE[tmp_param_type];
              if (input_opts.isXml) {
                input_parent_obj[val.paramKey] = `${tmp_num_text}`;
              } else {
                try {
                  if (JSON.parse(tmp_num_text) > Number.MAX_SAFE_INTEGER) {
                    input_parent_obj[val.paramKey] = `eo_big_int_${tmp_num_text}`;
                  } else {
                    input_parent_obj[val.paramKey] = JSON.parse(tmp_num_text);
                  }
                } catch (JSON_PARSE_ERROR) {
                  input_parent_obj[val.paramKey] = `${tmp_num_text}`;
                }
              }
              break;
            }
            default: {
              //其他
              let tmp_default_value = input_parent_obj[val.paramKey] || vm.DEFAULT_REFS_FROM_EO_TYPE[tmp_param_type];
              try {
                input_parent_obj[val.paramKey] = JSON.parse(tmp_default_value);
              } catch (JSON_PARSE_ERROR) {
                input_parent_obj[val.paramKey] = `${tmp_default_value}`;
              }
              break;
            }
          }
        }
        if (input_opts.isXml && input_opts.fnSetXmlAttr && val.attribute) {
          input_opts.fnSetXmlAttr(val.paramKey, val.attribute);
        }
      });
      return input_parent_obj;
    }
    /**
     * @desc 绑定管理解析
     * @param  {string} input_old_text 源数据
     * @param  {object} input_bind_obj 待解析的绑定对象
     * @return {string}   替换绑定变量后的字符串
     */
    replace_text_from_bind_obj(input_old_text, input_bind_obj) {
      let vm = this;
      if (!input_bind_obj) return input_old_text;
      input_old_text = input_old_text || '';
      let response = input_bind_obj.response,
        responseHeaders = input_bind_obj.responseHeaders,
        requestBody = input_bind_obj.requestBody,
        requestHeaders = input_bind_obj.requestHeaders,
        restParams = input_bind_obj.restParams,
        queryParams = input_bind_obj.queryParams;
      let tmp_result = input_old_text,
        tmp_fn_replace_bind_text = (tmp_input_mark, tmp_input_match_text_arr) => {
          tmp_input_match_text_arr.map(function (val) {
            let tmp_new_text = '';
            try {
              let tmp_header_key_end_index = val.indexOf(']'); //头部信息关键字结束字符
              tmp_new_text = eval(
                /Headers/.test(tmp_input_mark)
                  ? `${val.substring(1, val.indexOf(']'))}${val.substring(tmp_header_key_end_index, val.length - 1).toLowerCase()}`
                  : val.substring(1, val.length - 1)
              );
              if (tmp_new_text === undefined) {
                tmp_new_text = 'NULL';
              } else if (typeof tmp_new_text == 'object') {
                tmp_new_text = JSON.stringify(tmp_new_text);
              }
            } catch (EVAL_ERR) {
              tmp_new_text = 'NULL';
            }
            tmp_result = vm.text_replace_all('.' + val + '.', tmp_new_text, tmp_result);
            tmp_result = vm.text_replace_all('.' + val, tmp_new_text, tmp_result);
            tmp_result = vm.text_replace_all(val + '.', tmp_new_text, tmp_result);
            tmp_result = vm.text_replace_all(val, tmp_new_text, tmp_result);
          });
          return;
        };
      tmp_fn_replace_bind_text('requestBody', input_old_text.trim().match(/(<requestBody[.\[])((?!(>)).)*(>)/g) || []);
      tmp_fn_replace_bind_text('requestHeaders', input_old_text.trim().match(/(<requestHeaders[.\[])((?!(>)).)*(>)/g) || []);
      tmp_fn_replace_bind_text('restParams', input_old_text.trim().match(/(<restParams[.\[])((?!(>)).)*(>)/g) || []);
      tmp_fn_replace_bind_text('queryParams', input_old_text.trim().match(/(<queryParams[.\[])((?!(>)).)*(>)/g) || []);
      tmp_fn_replace_bind_text('responseHeaders', input_old_text.trim().match(/(<responseHeaders[.\[])((?!(>)).)*(>)/g) || []);
      tmp_fn_replace_bind_text('response', input_old_text.trim().match(/(<response[.\[])((?!(>)).)*(>)/g) || []);
      return tmp_result;
    }
    /**
     * 文本替换全部
     * @param {string} input_old_text 被替换文本
     * @param {string} input_new_text 替换文本
     * @param {any} input_text 源数据
     */
    text_replace_all(input_old_text, input_new_text, input_text) {
      if (input_old_text === input_new_text) return input_text;
      let tmp_text = input_text || '';
      if (typeof tmp_text !== 'string') {
        try {
          tmp_text = JSON.stringify(tmp_text);
          return JSON.parse(tmp_text.split(input_old_text).join(input_new_text));
        } catch (JSON_ERR) {}
      }
      return tmp_text.split(input_old_text).join(input_new_text);
    }
    /**
     * @desc 表达式构造器
     * @param {*} input_text
     * @returns {string} 构造后内容
     */
    construct_text_by_express_builder(input_text) {
      return input_text;
    }
    check_empty_obj(input_check_obj) {
      for (let key in input_check_obj) {
        return false;
      }
      return true;
    }
  }

  exports.core = main;
})();
