/**
 * @author Eoapi
 * @description 默认列表组件
 * @extend {object} authorityObject 权限类{operate}
 * @extend {object} mainObject 主类{setting:{colspan,warning},item:{default,fun}}
 * @extend {object} showObject 列表ITEM显示
 * @extend {object} otherObject 批量操作等额外对象
 * @extend {Object} pageObject 页码
 */
angular.module("eolinker").component("listDefaultCommonComponent", {
  template: `<div
    class="common_scss_list"
    inner-html-common-directive
    remove="true"
    html="$ctrl.data.tableHtml"
  ></div>`,
  controller: listDefaultController,
  bindings: {
    authorityObject: "<",
    mainObject: "<",
    showObject: "<",
    otherObject: "=",
    list: "<",
    pageObject: "<",
  },
});

listDefaultController.$inject = ["$scope", "$element"];

function listDefaultController($scope, $element) {
  var vm = this;
  vm.data = {
    selectAllMore: false,
    listOrderBy: {},
    defaultDropMenu: {},
  };
  vm.fun = {};
  var fun = {},
    privateFun = {};
  fun.generateHtml = function (type, array) {
    var template = {
      html: "",
    };
    switch (type) {
      case "select": {
        template.html = `<td class="${
          !vm.mainObject.setting.page
            ? "select_checkbox w_30"
            : "select_checkbox w_50"
        }"`;
        if (vm.mainObject.setting.batch) {
          template.html +=
            ' ng-show="$ctrl.otherObject.batch.isOperating==true"';
        }
        template.html +=
          ">" +
          '<button  type="button" class="eo-checkbox iconfont" ng-class="{\'icon-duihao\':$ctrl.otherObject.batch.indexAddress[item.' +
          vm.mainObject.item.primaryKey +
          ']}"  ' +
          (vm.mainObject.item.batchItemExpression || "") +
          " >{{$ctrl.otherObject.batch.indexAddress[item." +
          vm.mainObject.item.primaryKey +
          "]?'':'&nbsp;'}}</button></td>";
        break;
      }
    }
    return template.html;
  };
  vm.fun.autoSortFun = (inputArg, inputDesc) => {
    if (inputArg.$event && inputArg.$event.button !== 0) return;
    if (inputArg.listItem.sort !== true) return;
    if (
      vm.mainObject.setting.batch &&
      ((vm.otherObject.batch.isOperating &&
        vm.mainObject.setting.batchInitStatus !== "open") ||
        (vm.otherObject.batchMenu && vm.otherObject.batchMenu.isOperating))
    )
      return;
    let listOrderBy = {
      orderBy: inputArg.item.sortOrderByVal,
    };
    if (vm.data.listOrderBy.orderBy === inputArg.item.sortOrderByVal) {
      listOrderBy.asc =
        inputDesc !== undefined ? inputDesc : inputArg.item.asc == 0 ? 1 : 0;
    } else {
      listOrderBy.asc = inputDesc !== undefined ? inputDesc : inputArg.item.asc;
    }
    let isStop = vm.mainObject.baseFun.autoSortFun({
      listOrderBy: listOrderBy,
    });
    if (!isStop) {
      inputArg.item.asc = listOrderBy.asc;
      vm.data.listOrderBy = listOrderBy;
      if (vm.mainObject.setting.sortStorageKey) {
        window.localStorage.setItem(
          vm.mainObject.setting.sortStorageKey,
          angular.toJson(listOrderBy)
        );
      }
    }
  };
  /**
   * @desc 拖动鼠标放开操作
   */
  privateFun.dragMouseup = (inputMark, inputWidth) => {
    vm.mainObject.setting.dragCacheObj[inputMark] = inputWidth;
    if (vm.mainObject.setting.dragCacheVar)
      window.localStorage.setItem(
        vm.mainObject.setting.dragCacheVar,
        JSON.stringify(vm.mainObject.setting.dragCacheObj)
      );
  };

  fun.getTargetEvent = function ($event, inputPointAttr) {
    var itemIndex = $event.getAttribute(inputPointAttr || "eo-attr-index");
    if (itemIndex) {
      return $event;
    } else {
      return fun.getTargetEvent($event.parentNode, inputPointAttr);
    }
  };
  fun.getTargetIndex = function ($event, inputPointAttr) {
    var itemIndex = $event.getAttribute(inputPointAttr || "eo-attr-index");
    if (itemIndex) {
      return itemIndex;
    } else {
      return fun.getTargetIndex($event.parentNode, inputPointAttr);
    }
  };
  fun.operateLevel = function (inputDepth, $event, inputIndex) {
    var tmp = {
        operateName: angular.element($event).hasClass("ng-hide")
          ? "removeClass"
          : "addClass",
      },
      tmpParentIsShrinkIndex = inputIndex,
      itemIndex = inputIndex;
    while ($event && inputDepth < $event.getAttribute("eo-attr-depth")) {
      switch (tmp.operateName) {
        case "addClass": {
          vm.list[itemIndex].isHide = true;
          break;
        }
        case "removeClass": {
          var tmpParentShrinkObject = vm.list[tmpParentIsShrinkIndex];
          if (
            vm.list[itemIndex].isShrink &&
            vm.list[itemIndex].listDepth <= tmpParentShrinkObject.listDepth
          ) {
            vm.list[itemIndex].isHide = false;
            tmpParentIsShrinkIndex = itemIndex;
          } else if (
            vm.list[itemIndex].listDepth <= tmpParentShrinkObject.listDepth
          ) {
            vm.list[itemIndex].isHide = false;
            tmpParentIsShrinkIndex = itemIndex;
          } else if (!tmpParentShrinkObject.isShrink) {
            vm.list[itemIndex].isHide = false;
          }
          break;
        }
      }
      itemIndex++;
      $event = $event.nextElementSibling;
    }
  };
  vm.fun.shrinkList = function ($event) {
    $event.stopPropagation();
    var tmp = {};
    tmp.targetDom = fun.getTargetEvent($event.target);
    tmp.itemIndex = fun.getTargetIndex($event.target);
    vm.list[tmp.itemIndex].isShrink = !vm.list[tmp.itemIndex].isShrink;
    fun.operateLevel(
      tmp.targetDom.getAttribute("eo-attr-depth"),
      tmp.targetDom.nextElementSibling,
      parseInt(tmp.itemIndex) + 1
    );
  };
  privateFun.init = () => {
    if (!vm.mainObject) return;
    //默认可拖动
    // vm.mainObject.setting.hasOwnProperty("draggable")?"":(vm.mainObject.setting.draggable=true);
    var template = {
        itemHtml: "",
        operateHtml: "",
        thItemHtml: "",
        moreFunArrHtml: "",
      },
      tmpItemDragHtml = "",
      tmpDragObj;
    if (vm.mainObject.setting.draggable) {
      try {
        let tmpOriginDragCacheObj = vm.mainObject.setting.dragCacheObj;
        vm.mainObject.setting.dragCacheObj = Object.assign(
          {},
          tmpOriginDragCacheObj,
          JSON.parse(
            window.localStorage.getItem(vm.mainObject.setting.dragCacheVar)
          ) || {}
        );
        for (let key in vm.mainObject.setting.dragCacheObj) {
          if (vm.mainObject.setting.dragCacheObj[key] === "0px") {
            vm.mainObject.setting.dragCacheObj[key] =
              tmpOriginDragCacheObj[key];
          }
        }
      } catch (JSON_PARSE_ERROR) {
        console.error(JSON_PARSE_ERROR);
      }
      tmpDragObj = {
        setting: {
          object: "width",
          affectCount: 2,
          minWidth: 30,
        },
        baseFun: {
          mouseup: privateFun.dragMouseup,
        },
      };
    }
    if (vm.mainObject.setting.batch || vm.mainObject.setting.radio) {
      template.itemHtml = fun.generateHtml("select");
    }
    if (vm.mainObject.item.default) {
      if (vm.mainObject.setting.autoSort) {
        let storageOrderBy =
          window.localStorage[vm.mainObject.setting.sortStorageKey];
        if (storageOrderBy) {
          vm.data.listOrderBy = JSON.parse(storageOrderBy);
        } else {
          vm.data.listOrderBy = vm.mainObject.setting.sortDefaultVal.storageVal;
        }
      }
      let tmp_width =
        $element[0].offsetWidth / (vm.mainObject.item.default.length + 1); //拖动的均分
      angular.forEach(vm.mainObject.item.default, function (listItem, thKey) {
        let thItemContent = "";
        switch (listItem.thType) {
          case "html": {
            thItemContent = listItem.thHtml || "";
            break;
          }
          default: {
            thItemContent = `<span>${listItem.key}</span>`;
          }
        }
        if (vm.mainObject.setting.autoSort && listItem.sort) {
          if (vm.data.listOrderBy.orderBy === listItem.sortOrderByVal) {
            listItem.asc = vm.data.listOrderBy.asc;
          } else {
            listItem.asc =
              vm.mainObject.setting.sortDefaultVal.sortOrder === "asc" ? 1 : 0;
          }
        }
        if (vm.mainObject.setting.draggable) {
          listItem.draggableMainObject = Object.assign({}, tmpDragObj, {
            mark: listItem.draggableCacheMark,
          });
        }
        template.thItemHtml += `<th class="${
          vm.mainObject.setting.draggaRootClass
            ? vm.mainObject.setting.draggaRootClass + thKey
            : "th_drag_" + thKey + "_ldcc"
        } po_re ${listItem.thClass || ""} ${listItem.class || ""}" 
                ${
                  listItem.sortAndFilterConf
                    ? ""
                    : vm.mainObject.setting.autoSort && listItem.sort
                    ? ` ng-mousedown="$ctrl.fun.autoSortFun({$event:$event,item:$ctrl.mainObject.item.default[${thKey}],listItem:$ctrl.mainObject.item.default[${thKey}]})" ng-class="{\'hover_th_ldcc\':$ctrl.mainObject.item.default[${thKey}].sort&&(!$ctrl.otherObject.batchMenu.isOperating&&(!$ctrl.otherObject.batch.isOperating||$ctrl.mainObject.setting.batchInitStatus===\'open\'))}" `
                    : ""
                }
                ${
                  vm.mainObject.setting.draggable
                    ? `style="width:${
                        vm.mainObject.setting.dragCacheObj[
                          listItem.draggableCacheMark
                        ] || `${tmp_width}px`
                      }"`
                    : ""
                }  
                ${
                  listItem.showVariable
                    ? `ng-show="$ctrl.showObject['${listItem.showPoint}']['${
                        listItem.showVariable
                      }']==${
                        typeof listItem.show === "string"
                          ? `'${listItem.show}'`
                          : listItem.show
                      }"`
                    : listItem.showPoint
                    ? `ng-show="$ctrl.showObject['${listItem.showPoint}']==${
                        typeof listItem.show === "string"
                          ? `'${listItem.show}'`
                          : listItem.show
                      }" `
                    : ""
                } 
                >${thItemContent}  
            ${
              vm.mainObject.setting.autoSort &&
              (listItem.sort || listItem.sortAndFilterConf)
                ? `<span  ng-if="$ctrl.mainObject.item.default[${thKey}].sort" class="iconfont  focus_orderby" ng-class="{${
                    listItem.sortAndFilterConf
                      ? `'hidden':$ctrl.data.listOrderBy.orderBy!==${
                          typeof listItem.sortOrderByVal === "number"
                            ? listItem.sortOrderByVal
                            : `'${listItem.sortOrderByVal}'`
                        },`
                      : `'un_focus_orderBy':$ctrl.data.listOrderBy.orderBy!==${
                          typeof listItem.sortOrderByVal === "number"
                            ? listItem.sortOrderByVal
                            : `'${listItem.sortOrderByVal}'`
                        },`
                  }'icon-chevron-down':!$ctrl.mainObject.item.default[${thKey}].asc,'icon-chevron-up':$ctrl.mainObject.item.default[${thKey}].asc}"></span>${
                    listItem.sortAndFilterConf
                      ? `<sort-And-Filter-List-Default-Component other-obj="{isBatch:$ctrl.otherObject.batchMenu?$ctrl.otherObject.batchMenu.isOperating:$ctrl.otherObject.batch.isOperating}" class="po_ab eo_to_top_11 ml5 mr-[5px] ${
                          listItem.sortAndFilterConf.containerClass || ""
                        }" main-obj="$ctrl.mainObject.item.default[${thKey}].sortAndFilterConf" filter-fun="$ctrl.mainObject.item.default[${thKey}].filterFun(arg)" sort-fun="$ctrl.fun.autoSortFun({$event:$event,item:$ctrl.mainObject.item.default[${thKey}],listItem:$ctrl.mainObject.item.default[${thKey}]},arg)"></sort-And-Filter-List-Default-Component>`
                      : ``
                  }`
                : ""
            }
            <div class="divide_line_ldcc ${
              vm.mainObject.setting.draggable ? "ccr" : ""
            }" ${
          vm.mainObject.setting.draggable
            ? `drag-Change-Spacing-Common-Directive main-object='$ctrl.mainObject.item.default[${thKey}].draggableMainObject' container-affect-class="conatiner_ldcc" affect-Class="${
                vm.mainObject.setting.draggaRootClass
                  ? vm.mainObject.setting.draggaRootClass + thKey
                  : "th_drag_" + thKey + "_ldcc"
              }"`
            : ""
        }>&nbsp;</div></th>`;
        tmpItemDragHtml += `<th class="${
          vm.mainObject.setting.draggaRootClass
            ? vm.mainObject.setting.draggaRootClass + thKey
            : "th_drag_" + thKey + "_ldcc"
        } po_re ${listItem.thClass || ""} ${listItem.class || ""}" ${
          vm.mainObject.setting.draggable
            ? `style="width:${
                vm.mainObject.setting.dragCacheObj[
                  listItem.draggableCacheMark
                ] || `${tmp_width}px`
              }"`
            : ""
        } ${
          listItem.showVariable
            ? `ng-show="$ctrl.showObject['${listItem.showPoint}']['${
                listItem.showVariable
              }']==${
                typeof listItem.show === "string"
                  ? `'${listItem.show}'`
                  : listItem.show
              }"`
            : listItem.showPoint
            ? `ng-show="$ctrl.showObject['${listItem.showPoint}']==${
                typeof listItem.show === "string"
                  ? `'${listItem.show}'`
                  : listItem.show
              }" `
            : ""
        }  >&nbsp;</th>`;
        switch (listItem.type) {
          default: {
            template.itemHtml += `<td class="${
              listItem.isUnneccessary ? "eo_theme_ldt_tdt " : ""
            } ${listItem.class || ""} ${listItem.contentClass || ""}" 
                            ${
                              listItem.tdExpression ? listItem.tdExpression : ""
                            }
                            ${
                              listItem.showVariable
                                ? `ng-show="$ctrl.showObject['${
                                    listItem.showPoint
                                  }']['${listItem.showVariable}']==${
                                    typeof listItem.show === "string"
                                      ? `'${listItem.show}'`
                                      : listItem.show
                                  }"`
                                : listItem.showPoint
                                ? `ng-show="$ctrl.showObject['${
                                    listItem.showPoint
                                  }']==${
                                    typeof listItem.show === "string"
                                      ? `'${listItem.show}'`
                                      : listItem.show
                                  }" `
                                : ""
                            }
                            ${
                              listItem.switch
                                ? `ng-switch="item.${listItem.switch}" `
                                : ""
                            }
                            ${
                              listItem.title ? `title="${listItem.title}" ` : ""
                            }
                            >${
                              vm.mainObject.setting.canOpenLink &&
                              !listItem.cancelLink
                                ? `<a onclick="return false" class="list_td_link text-omit"  ng-href="{{$ctrl.fun.getNewTabHref({item:item})}}">${listItem.html}</a>`
                                : listItem.html
                            }</td>\n`;
          }
        }
      });
    }
    if (vm.mainObject.item.operate) {
      angular.forEach(
        vm.mainObject.item.operate.funArr,
        function (button, key) {
          switch (button.type) {
            case "more": {
              vm.data.defaultDropMenu[key] = [];
              angular.forEach(
                button.funArr,
                function (moreButton, moreButtonKey) {
                  vm.data.defaultDropMenu[key].push(
                    Object.assign({}, moreButton, {
                      key: moreButton.html || moreButton.key,
                      expression: `${moreButton.itemExpression || ""} ${
                        moreButton.showPoint
                          ? ` ng-show="item['${moreButton.showPoint}']==${moreButton.show}" `
                          : ""
                      }`,
                    })
                  );
                }
              );
              template.operateHtml += `<button type="button" ${
                button.disabledHtml
                  ? `ng-disabled="${button.disabledHtml}"`
                  : ""
              } eo-Drop-Elem other-Obj="{target:item,authority:$ctrl.authorityObject}" fn-click="$ctrl.fun.common(target,{item:item,$index:$index},itemEvent)" text-arr="$ctrl.data.defaultDropMenu[${key}]" ${
                button.authority
                  ? ` ng-if="$ctrl.authorityObject['${button.authority}']"`
                  : ""
              } class="${button.class || ""} more-btn eo-operate-btn po_re " ${
                (button.showPoint
                  ? ` ng-show="item[$ctrl.mainObject.item.operate.funArr[${key}].showPoint]==$ctrl.mainObject.item.operate.funArr[${key}].show"`
                  : "") + (button.itemExpression || "")
              }>${button.key}${
                button.isHideSwitchBtn
                  ? ``
                  : `<span class="more-btn-icon iconfont icon-chevron-down"></span>`
              }</button>`;
              break;
            }
            case "html": {
              template.operateHtml += button.html;
              break;
            }
            default: {
              template.operateHtml += '<button type="button" class="';
              if (button.class) {
                template.operateHtml += button.class;
              }
              template.operateHtml += ' eo-operate-btn"';
              if (button.itemExpression) {
                template.operateHtml += button.itemExpression;
              }
              if (button.authority) {
                template.operateHtml += ` ng-if="$ctrl.authorityObject['${
                  button.authority
                }']${button.ifExprss ? `&&${button.ifExprss}` : ""}"`;
              }
              if (button.authorityPoint) {
                template.operateHtml +=
                  " ng-if=\"item['" +
                  button.authorityPoint +
                  "']==" +
                  button.authorityVal +
                  '"';
              }
              if (button.showPoint) {
                template.operateHtml +=
                  " ng-show=\"item['" +
                  button.showPoint +
                  "']==" +
                  button.show +
                  '"';
              }
              if (button.showHtml) {
                template.operateHtml += ' ng-show="' + button.showHtml + '"';
              }
              if (button.disabledHtml) {
                template.operateHtml += ` ng-disabled="${button.disabledHtml}" `;
              }
              if (button.disabledVar) {
                template.operateHtml +=
                  " ng-disabled=\"item['" +
                  button.disabledVar +
                  "']==" +
                  button.disabled +
                  '" ';
              }
              if (button.fun) {
                template.operateHtml +=
                  ' ng-click="$ctrl.fun.common($ctrl.mainObject.item.operate.funArr[' +
                  key +
                  '],{item:item,$index:$outerIndex,$event:$event})"';
              }
              template.operateHtml += ">";
              if (button.icon) {
                template.operateHtml +=
                  '<span class="iconfont icon-' + button.icon + '"></span>';
              }
              template.operateHtml += button.key + "</button>";
            }
          }
        }
      );
      template.operateHtml =
        '<td class="operate-td  ' +
        (vm.mainObject.item.operate.class || "") +
        '" ' +
        (vm.mainObject.item.operate.listExpression || "") +
        (vm.mainObject.setting.batch
          ? "ng-hide=\"$ctrl.mainObject.setting.batchInitStatus!=='open'&&$ctrl.otherObject.batch.isOperating\""
          : "") +
        ' ng-if="$ctrl.authorityObject.operate">' +
        "<div " +
        (vm.mainObject.item.operate.hideKey
          ? 'ng-if="!(' + vm.mainObject.item.operate.hideKey + ')"'
          : "") +
        ">" +
        template.operateHtml +
        "</div>" +
        "</td>";
    }
    vm.data.selectAllSubMenuArr = [
      {
        class: "btn_select_all",
        key: "选择所有数据 （共{{$ctrl.otherObj.msgCount}}条）",
      },
      {
        class: "btn_select_view",
        key: "选择可见数据 （共{{(($ctrl.otherObj.page*$ctrl.otherObj.pageSize+($ctrl.otherObj.extraOprNum||0))>$ctrl.otherObj.msgCount)?$ctrl.otherObj.msgCount:($ctrl.otherObj.pageSize*$ctrl.otherObj.page+($ctrl.otherObj.extraOprNum||0))}}条）",
      },
    ];
    let tmpSelectClass = vm.mainObject.setting.batchClass
      ? vm.mainObject.setting.batchClass
      : !vm.mainObject.setting.page
      ? "w_30"
      : "w_50";
    let tmpThHtml =
      (vm.mainObject.setting.radio
        ? `<th class="w_30"  ng-show="$ctrl.otherObject.batch.isOperating">`
        : "") +
      (vm.mainObject.setting.batch
        ? `<th class="select_checkbox ${tmpSelectClass}"  ng-show="$ctrl.otherObject.batch.isOperating">` +
          (!vm.mainObject.setting.page
            ? `<button  type="button" ng-click="$ctrl.fun.selectAll()" class="eo-checkbox iconfont" ng-class="{\'icon-duihao\':$ctrl.otherObject.batch.selectAll==true}">{{$ctrl.otherObject.batch.selectAll?"":"&nbsp;"}}</button>${
                vm.mainObject.setting.batchText
                  ? `<span>${vm.mainObject.setting.batchText}</span>`
                  : ""
              }`
            : `<div class="select_all_box f_row f_ac cp" ng-click="$ctrl.fun.selectAll({$event:$event})">
                <button  type="button"  class="eo-checkbox iconfont" ng-class="{'icon-duihao':$ctrl.otherObject.batch.selectAll==true}">{{$ctrl.otherObject.batch.selectAll?"":"&nbsp;"}}</button>
                <button type="button" ng-repeat="item in ['i just dark magic']" class="btn_all_show_more select_all_show_more" eo-Drop-Elem text-arr="$ctrl.data.selectAllSubMenuArr" other-obj="$ctrl.pageObject.pageInfo" fn-click="$ctrl.fun.selectAll({},itemEvent)"><span class="btn_all_show_more iconfont icon-chevron-down fs12 fwb"></span></button>`) +
          "</th>"
        : "") +
      template.thItemHtml +
      '<th class="{{$ctrl.mainObject.item.operate.class}}" ng-style="$ctrl.mainObject.item.operate.style"' +
      (vm.mainObject.item.operate && vm.mainObject.item.operate.listExpression
        ? vm.mainObject.item.operate.listExpression
        : "") +
      '  ng-if="$ctrl.authorityObject.operate&&$ctrl.mainObject.item.operate" ng-hide="$ctrl.mainObject.setting.batchInitStatus!==\'open\'&&$ctrl.otherObject.batch.isOperating">' +
      (vm.mainObject.setting.operateThKey || "操作") +
      `</th>${vm.mainObject.setting.draggable ? "<th></th>" : ""}`;
    let tmpDragHtml =
      (vm.mainObject.setting.radio
        ? `<th class="w_30"  ng-show="$ctrl.otherObject.batch.isOperating">`
        : "") +
      (vm.mainObject.setting.batch
        ? `<th class="select_checkbox ${tmpSelectClass}"  ng-show="$ctrl.otherObject.batch.isOperating">&nbsp;</th>`
        : "") +
      tmpItemDragHtml +
      `<th class="{{$ctrl.mainObject.item.operate.class}}" ng-style="$ctrl.mainObject.item.operate.style" ${
        vm.mainObject.item.operate && vm.mainObject.item.operate.listExpression
          ? vm.mainObject.item.operate.listExpression
          : ""
      } ng-if="$ctrl.authorityObject.operate&&$ctrl.mainObject.item.operate" ng-hide="$ctrl.mainObject.setting.batchInitStatus!==\'open\'&&$ctrl.otherObject.batch.isOperating">&nbsp;</th>${
        vm.mainObject.setting.draggable ? "<th></th>" : ""
      }`;

    template.html = `<tr ng-hide="item.isHide&&$ctrl.data.isDepth"  eo-attr-index="{{$index}}" eo-attr-depth="{{item.listDepth}}"   ng-style="$ctrl.mainObject.setting.style" {{trExpression}}   ${
      vm.mainObject.item.primaryKey
        ? `ng-class="{'hover-tr':!$ctrl.mainObject.setting.unhover||$ctrl.otherObject.batch.isOperating,'unhover-tr':$ctrl.mainObject.setting.unhover&&!$ctrl.otherObject.batch.isOperating,'eo_theme_lct_tra':$ctrl.otherObject.batch.indexAddress[item.${vm.mainObject.item.primaryKey}],{{trNgClass}}}"`
        : 'class="' +
          (vm.mainObject.setting.unhover ? "unhover-tr" : "hover-tr") +
          '" ng-class="{{{trNgClass}}}"'
    }  ng-repeat='($outerIndex,item) in $ctrl.list' ng-click="$ctrl.fun.click({item:item,$index:$index,$event:$event})">${
      template.itemHtml + template.operateHtml
    }${vm.mainObject.setting.draggable ? "<td></td>" : ""}</tr>`;
    try {
      template.html = template.html.replace(
        "{{trExpression}}",
        vm.mainObject.setting.trExpression || ""
      );
      template.html = template.html.replace(
        "{{trNgClass}}",
        vm.mainObject.setting.trNgClass || ""
      );
    } catch (REPLACE_ERR) {
      console.error(REPLACE_ERR);
    }
    vm.data.tableHtml =
      '<article class="eo_theme_ldt first_level_article ' +
      (vm.mainObject.setting.isFixedHeight
        ? " eo_theme_lrd fixed-height-list "
        : "") +
      (vm.mainObject.setting.isGreyShading ? "eo_theme_lrt" : "") +
      ' ">' +
      '<div class="conatiner_ldcc ' +
      (vm.mainObject.setting.draggaRootClass || "") +
      (vm.mainObject.setting.draggable ? " conatiner_ldcc_draggable " : "") +
      (vm.mainObject.setting.page ? "conatiner_ldcc_has_footer" : "") +
      ' "><div class="thead_container_ldcc' +
      (vm.mainObject.setting.trClass || "") +
      ' " ng-if="' +
      (vm.mainObject.setting.showHead == null
        ? true
        : vm.mainObject.setting.showHead) +
      '"><table>' +
      "<thead>" +
      `<tr>${tmpThHtml}</tr>` +
      `</thead></table></div>` +
      `<div class="tbody_container_ldcc ${
        vm.mainObject.setting.trClass || ""
      } " >
            <table` +
      (vm.mainObject.setting.scroll
        ? ' infinite-scroll="$ctrl.mainObject.baseFun.scrollLoading()" infinite-scroll-parent infinite-scroll-distance="$ctrl.mainObject.setting.scrollRemainRatio||0">'
        : ">") +
      ('<thead class="vis_hid unplaceholder_thead_ldcc"><tr>' +
        tmpDragHtml +
        "</tr></thead>") +
      '<tbody class="list-default-tbody">' +
      template.html +
      '</tbody></table><div class="none_div" ng-if="$ctrl.list.length===0"> ' +
      (vm.mainObject.setting.warning || "尚无任何内容") +
      " </div></div></div>" +
      (vm.mainObject.setting.page
        ? `<div class="footer">
            <span ng-if="$ctrl.mainObject.setting.batchInitStatus!=='open'&&$ctrl.otherObject.batch.isOperating">已选择{{$ctrl.otherObject.batch.query.length}}条记录</span>
            <span ng-if="$ctrl.mainObject.setting.batchInitStatus==='open'||!$ctrl.otherObject.batch.isOperating">已加载{{(($ctrl.pageObject.pageInfo.page*$ctrl.pageObject.pageInfo.pageSize+($ctrl.pageObject.pageInfo.extraOprNum||0))>$ctrl.pageObject.pageInfo.msgCount)?$ctrl.pageObject.pageInfo.msgCount:($ctrl.pageObject.pageInfo.pageSize*$ctrl.pageObject.pageInfo.page+($ctrl.pageObject.pageInfo.extraOprNum||0))}}条记录，共{{$ctrl.pageObject.pageInfo.msgCount}}条记录</span>
            </div>`
        : "") +
      "</article>";
  };
  /**
   * 初始化单项表格
   */
  vm.$onInit = function () {
    vm.authorityObject={operate:1}
    privateFun.init();
  };
  // $rootScope.global.$watch.push(
  //   $scope.$watch("$ctrl.mainObject.item.default", privateFun.init)
  // );
  $scope.$watch("$ctrl.mainObject.item.default", privateFun.init);
  fun.countItemSelectIsAll = function (inputBool) {
    if (inputBool) {
      if (vm.mainObject.setting.page) {
        let returnFlag = false;
        for (var i = 0; i < vm.list.length; i++) {
          if (
            vm.otherObject.batch.query.indexOf(
              vm.list[i][vm.mainObject.item.primaryKey]
            ) === -1
          ) {
            returnFlag = true;
            break;
          }
        }
        if (vm.list.length && !returnFlag)
          vm.otherObject.batch.selectAll = true;
      } else {
        if (
          (vm.otherObject.batch.query || []).length == (vm.list || []).length
        ) {
          vm.otherObject.batch.selectAll = true;
        }
      }
    } else {
      vm.otherObject.batch.selectAll = false;
    }
  };
  privateFun.selectBatch = (inputArg) => {
    if (vm.mainObject.setting.batchInitStatus !== "open") {
      vm.otherObject.batch.query = [];
      vm.otherObject.batch.indexAddress = {};
      if (inputArg.selectType === "cancel") {
        return;
      }
    }
    switch (inputArg.queryType) {
      case "item": {
        if (vm.mainObject.setting.hasOwnProperty("disabledSelectModelKey")) {
          inputArg.query.map(function (val) {
            if (
              val[vm.mainObject.setting.disabledSelectModelKey] !==
              vm.mainObject.setting.disabledSelectVal
            ) {
              privateFun.selectSingle(
                inputArg.selectType,
                val[vm.mainObject.item.primaryKey]
              );
            }
          });
        } else {
          inputArg.query.map(function (val) {
            privateFun.selectSingle(
              inputArg.selectType,
              val[vm.mainObject.item.primaryKey]
            );
          });
        }
        break;
      }
      default: {
        //id
        inputArg.query.map(function (val) {
          privateFun.selectSingle(inputArg.selectType, val);
        });
        break;
      }
    }
  };
  privateFun.selectSingle = (type, inputID, callbackInfo) => {
    if (vm.mainObject.baseFun && vm.mainObject.baseFun.beforeSelect) {
      if (!vm.mainObject.baseFun.beforeSelect(inputID)) return;
    }
    switch (type) {
      case "select": {
        if (
          vm.mainObject.setting.batchInitStatus === "open" &&
          vm.otherObject.batch.indexAddress[inputID]
        )
          return;
        vm.otherObject.batch.query.push(inputID);
        vm.otherObject.batch.indexAddress[inputID] = 1;
        break;
      }
      case "cancel": {
        if (
          vm.mainObject.setting.batchInitStatus === "open" &&
          !vm.otherObject.batch.indexAddress[inputID]
        )
          return;
        vm.otherObject.batch.query.splice(
          vm.otherObject.batch.query.findIndex((id) => id === inputID),
          1
        );
        delete vm.otherObject.batch.indexAddress[inputID];
        break;
      }
    }
    if (callbackInfo) {
      callbackInfo.fun(callbackInfo.param);
    }
  };
  vm.fun.click = function (arg) {
    var template = {
      $index: 0,
      batchFun: (arg) => {
        if (
          vm.mainObject.setting.unhover &&
          !vm.otherObject.batch.isOperating
        ) {
          let point = "";
          try {
            point = arg.$event.target.classList[0];
          } catch (e) {}
          if (point !== "eo-checkbox" && point != "select_checkbox") return;
        }
        let callbackFun = (inputArg) => {
          fun.countItemSelectIsAll(inputArg.bool);
          if (vm.mainObject.baseFun && vm.mainObject.baseFun.afterSelected) {
            vm.mainObject.baseFun.afterSelected(inputArg);
          }
        };
        if (
          vm.otherObject.batch.indexAddress[
            arg.item[vm.mainObject.item.primaryKey]
          ]
        ) {
          privateFun.selectSingle(
            "cancel",
            arg.item[vm.mainObject.item.primaryKey],
            {
              fun: callbackFun,
              param: {
                bool: false,
                type: "cancel",
                item: arg.item,
              },
            }
          );
        } else {
          privateFun.selectSingle(
            "select",
            arg.item[vm.mainObject.item.primaryKey],
            {
              fun: callbackFun,
              param: {
                bool: true,
                type: "select",
                item: arg.item,
              },
            }
          );
        }
      },
    };
    if (
      vm.mainObject.setting.batch &&
      vm.otherObject.batch.isOperating &&
      !vm.mainObject.setting.selfControllClickBatch
    ) {
      template.batchFun(arg);
      return;
    }
    if (vm.mainObject.baseFun && vm.mainObject.baseFun.click) {
      vm.mainObject.baseFun.click(arg, template.batchFun);
      return;
    }

    if (vm.mainObject.setting.radio && vm.otherObject.batch.isOperating) {
      template.$index = vm.otherObject.batch.query.indexOf(
        arg.item[vm.mainObject.item.primaryKey]
      );
      vm.otherObject.batch.query = [];
      vm.otherObject.batch.query.push(arg.item[vm.mainObject.item.primaryKey]);
      vm.otherObject.batch.indexAddress = {};
      vm.otherObject.batch.indexAddress[
        arg.item[vm.mainObject.item.primaryKey]
      ] = arg.$index + 1;
      if (vm.mainObject.baseFun && vm.mainObject.baseFun.batchFilter) {
        vm.mainObject.baseFun.batchFilter(arg);
      }
      return;
    }
  };
  privateFun.clearBatchData = () => {};
  /**
   * 初始化单项表格
   */
  vm.fun.selectAll = function (arg, inputEvent) {
    if (typeof arg === "object" && !arg.$event) arg.$event = inputEvent;
    if (vm.mainObject.baseFun && vm.mainObject.baseFun.selectAll) {
      if (vm.mainObject.setting.page) {
        let point = "default";
        try {
          point = arg.$event.target.classList[0];
        } catch (e) {}
        switch (point) {
          case "btn_all_show_more": {
            vm.data.selectAllMore = true;
            break;
          }
          case "eo-checkbox":
          case "btn_select_all": {
            if (point === "btn_select_all" || !vm.otherObject.batch.selectAll) {
              //选择所有数据
              vm.mainObject.baseFun.selectAll("selectAll");
              vm.data.selectAllMore = false;
            } else {
              vm.mainObject.baseFun.selectAll("cancelAll");
            }
            break;
          }
          case "btn_select_view": {
            //选择可见数据
            vm.mainObject.baseFun.selectAll("selectView");
            vm.data.selectAllMore = false;
            break;
          }
        }
      } else {
        vm.mainObject.baseFun.selectAll(arg);
      }
      return;
    }
    if (vm.mainObject.setting.page) {
      let point = "default";
      try {
        point = arg.$event.target.classList[0];
      } catch (e) {}
      switch (point) {
        case "btn_all_show_more": {
          vm.data.selectAllMore = true;
          break;
        }
        case "eo-checkbox":
        case "btn_select_all": {
          if (point === "btn_select_all" || !vm.otherObject.batch.selectAll) {
            //选择所有数据
            if (
              vm.pageObject.pageInfo.page ===
              Math.ceil(
                vm.pageObject.pageInfo.msgCount /
                  vm.pageObject.pageInfo.pageSize
              )
            ) {
              //已加载到最后一页，不获取primaryKey ID
              privateFun.selectBatch({
                selectType: "select",
                queryType: "item",
                query: vm.list,
              });
            } else {
              privateFun.selectBatch({
                selectType: "select",
                query: vm.otherObject.allQueryID,
              });
            }
            vm.data.selectAllMore = false;
            vm.otherObject.batch.selectAll = true;
          } else {
            privateFun.selectBatch({
              selectType: "cancel",
              query: vm.otherObject.allQueryID,
            });
            vm.otherObject.batch.selectAll = false;
          }
          break;
        }
        case "btn_select_view": {
          //选择可见数据
          vm.data.selectAllMore = false;
          privateFun.selectBatch({
            selectType: "select",
            queryType: "item",
            query: vm.list,
          });
          vm.otherObject.batch.selectAll = true;
          break;
        }
      }
    } else {
      let tmpList = vm.otherObject.allList ? vm.otherObject.allList : vm.list;
      if (vm.otherObject.batch.selectAll) {
        privateFun.selectBatch({
          selectType: "cancel",
          queryType: "item",
          query: tmpList,
        });
      } else {
        privateFun.selectBatch({
          selectType: "select",
          queryType: "item",
          query: tmpList,
        });
      }
      vm.otherObject.batch.selectAll = !vm.otherObject.batch.selectAll;
    }
  };
  /**
   * @description 统筹绑定调用页面列表功能单击函数
   * @param {extend} obejct 方式值
   * @param {object} arg 共用体变量，后根据传值函数回调方法
   */
  vm.fun.common = function (extend = {}, arg = {}, $event) {
    if (arg.$event) {
      arg.$event.stopPropagation();
    } else {
      arg.$event = $event;
    }
    if (!extend.fun) {
      vm.fun.click(arg);
      return;
    }
    var template = {
      params: angular.copy(arg),
    };
    switch (typeof extend.params) {
      case "string": {
        return eval("extend.fun(" + extend.params + ")");
      }
      default: {
        for (var key in extend.params) {
          if (extend.params[key] == null) {
            template.params[key] = arg[key];
          } else {
            template.params[key] = extend.params[key];
          }
        }
        return extend.fun(template.params);
      }
    }
  };
}
