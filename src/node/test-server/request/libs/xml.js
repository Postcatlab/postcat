(() => {
  'use strict';
  class mainClass {
    constructor() {}
    jsonToXml() {
      var XML = function () {};

      XML.ObjTree = function () {
        return this;
      };

      XML.ObjTree.prototype.xmlDecl = '<?xml version="1.0" encoding="UTF-8" ?>\n';
      XML.ObjTree.prototype.attr_prefix = '-';

      XML.ObjTree.prototype.writeXML = function (tree, attr_obj) {
        var xml = this.hash_to_xml(null, tree, attr_obj);
        return this.xmlDecl + xml;
      };

      XML.ObjTree.prototype.hash_to_xml = function (name, tree, attr_obj) {
        var elem = [];
        var attr = [];
        for (var key in tree) {
          if (!tree.hasOwnProperty(key)) continue;
          var val = tree[key],
            tmp_attr_obj = {};
          if (attr_obj[key]) {
            if (attr_obj[key] instanceof Array) {
              if (typeof val == 'object' && val.constructor == Array && attr_obj[key][1]) {
                //如果是数组，且没有子对象，则走此内容
                tmp_attr_obj = attr_obj[key];
              } else {
                tmp_attr_obj = attr_obj[key][1] || {};
                if (attr_obj[key][0]) key = `${key} ${attr_obj[key][0] || ''}`;
              }
            } else if (attr_obj[key]) key = `${key} ${attr_obj[key] || ''}`;
          }
          key = key.replace(/\s\s/g, ' ');
          if (key.charAt(0) != this.attr_prefix) {
            if (typeof val == 'undefined' || val == null) {
              elem[elem.length] = '<' + key + ' />';
            } else if (typeof val == 'object' && val.constructor == Array) {
              elem[elem.length] = this.array_to_xml(key, val, tmp_attr_obj);
            } else if (typeof val == 'object') {
              elem[elem.length] = this.hash_to_xml(key, val, tmp_attr_obj);
            } else {
              elem[elem.length] = this.scalar_to_xml(key, val);
            }
          } else {
            attr[attr.length] = ' ' + key.substring(1) + '="' + this.xml_escape(val) + '"';
          }
        }
        var jattr = attr.join('');
        var jelem = elem.join('');
        if (typeof name == 'undefined' || name == null) {
          // no tag
        } else if (elem.length > 0) {
          if (jelem.match(/\n/)) {
            jelem = '<' + name + jattr + '>\n' + jelem + '</' + (name || '').split(' ')[0] + '>\n';
          } else {
            jelem = '<' + name + jattr + '>' + jelem + '</' + (name || '').split(' ')[0] + '>\n';
          }
        } else {
          jelem = '<' + name + jattr + ' />\n';
        }
        return jelem;
      };

      XML.ObjTree.prototype.array_to_xml = function (name, array, attr_obj) {
        var out = [];
        for (var i = 0; i < array.length; i++) {
          var val = array[i];
          let tmp_name =
            attr_obj[0] && attr_obj[0][i] ? `${name} ${typeof (attr_obj[0] === 'string') ? attr_obj[0] : attr_obj[0][i]}` : name;
          if (typeof val == 'undefined' || val == null) {
            out[out.length] = '<' + tmp_name + ' />';
          } else if (typeof val == 'object' && val.constructor == Array) {
            out[out.length] = this.array_to_xml(tmp_name, val, attr_obj[i + 1]);
          } else if (typeof val == 'object') {
            out[out.length] = this.hash_to_xml(tmp_name, val, attr_obj[i + 1]);
          } else {
            out[out.length] = this.scalar_to_xml(tmp_name, val);
          }
        }
        return out.join('');
      };

      XML.ObjTree.prototype.scalar_to_xml = function (name, text) {
        if (name == '#text') {
          return this.xml_escape(text);
        } else {
          return '<' + name + '>' + this.xml_escape(text) + '</' + (name || '').split(' ')[0] + '>\n';
        }
      };

      XML.ObjTree.prototype.xml_escape = function (text) {
        let tmpResult = String(text);
        if (/<!\[CDATA/.test(tmpResult) && /]]>/.test(tmpResult)) {
          let tmpPreIndex = tmpResult.indexOf('<![CDATA[');
          let tmpLastIndex = tmpResult.substr(tmpPreIndex, tmpResult.length).indexOf(']]>') + 3;
          return (
            tmpResult.substr(0, tmpPreIndex).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') +
            tmpResult.substr(tmpPreIndex, tmpLastIndex) +
            tmpResult
              .substr(tmpLastIndex, tmpResult.length)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
          );
        }
        return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      };
      return function (input, inputXmlAttrObj) {
        var xotree = new XML.ObjTree();
        return xotree.writeXML(input, inputXmlAttrObj || {});
      };
    }
  }
  exports.core = mainClass;
})();
