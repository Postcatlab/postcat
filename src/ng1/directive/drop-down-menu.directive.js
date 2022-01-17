/**
 * @description 手动控制按钮focus状态，使用与mac os 非chrome浏览器
 * @author 广州银云信息科技有限公司
 */
angular
  .module('eolinker.directive')

  .directive('dropDownMenuCommonDirective', [
    '$rootScope',
    function ($rootScope) {
      return {
        restrict: 'AE',
        scope: {
          dirDisable: '<',
        },
        link($scope, elem, attrs, ctrl) {
          $scope.data = {
            elemArr: elem[0].getElementsByClassName('eo_more_btn'),
          };
          const privateFun = {};
          privateFun.initWatchDom = () => {
            // $rootScope.global.$watch.push($scope.$watch('data.elemArr.length', () => {
            //     if ($scope.data.elemArr) {
            //         let domArr = Array.prototype.slice.call($scope.data.elemArr);
            //         domArr.map((val) => {
            //             let tmpElem = val;
            //             angular.element(tmpElem).bind('click', (event) => {
            //                 tmpElem.focus();
            //             })
            //         })
            //     }

            // }));
            $scope.$watch('data.elemArr.length', () => {
              if ($scope.data.elemArr) {
                const domArr = Array.prototype.slice.call($scope.data.elemArr);
                domArr.map((val) => {
                  const tmpElem = val;
                  angular.element(tmpElem).bind('click', (event) => {
                    tmpElem.focus();
                  });
                });
              }
            });
          };
          const main = (function () {
            if (/macintosh|mac os x/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent)) {
              privateFun.initWatchDom();
              $scope.$on('$stateChangeStart', () => {
                $scope.data.elemArr = null;
              });
              $scope.$on('$stateChangeSuccess', () => {
                if (!$scope.data.elemArr) {
                  $scope.data.elemArr = elem[0].getElementsByClassName('eo_more_btn');
                  privateFun.initWatchDom();
                }
              });
            }
          })();
        },
      };
    },
  ])
  .directive('eoDropRoot', [
    function () {
      return {
        restrict: 'A',
        controllerAs: '$ctrl',
        controller: [
          '$scope',
          '$compile',
          '$element',
          function ($scope, $compile, $element) {
            const vm = this;
            const privateFun = {};
            const data = {};
            privateFun.getTargetValue = function ($event, inputPointAttr) {
              if (!$event) return;
              const tmpVal = $event.getAttribute(inputPointAttr || 'eo-attr-value');
              if ($event.getAttribute('class') && $event.getAttribute('class').indexOf('eo-drop-root') !== -1) {
                return null;
              }
              if (tmpVal !== null) {
                return tmpVal;
              } else {
                return privateFun.getTargetValue($event.parentNode, inputPointAttr);
              }
            };
            vm.data = {
              showDropMenu: false,
            };
            vm.fnStopPropagation = (inputEvent) => {
              vm.data.containerFocus = true;
              inputEvent.stopPropagation();
            };
            vm.fnClearStopPropagation = () => {
              privateFun.resetConf();
            };
            vm.fnWatchUi = (inputEvent) => {
              inputEvent.preventDefault();
              const tmpValue = privateFun.getTargetValue(inputEvent.target);
              if (tmpValue === null) return;
              if (vm.data.targetParentIndex != null) {
                vm.data.fnClick({
                  target: vm.data.textObj[vm.data.targetParentIndex].childs[tmpValue],
                  itemEvent: inputEvent,
                });
              } else if (vm.data.textObj[tmpValue]) {
                vm.data.fnClick({
                  target: vm.data.textObj[tmpValue],
                  itemEvent: inputEvent,
                });
              } else {
                vm.data.fnClick({
                  target: tmpValue,
                  itemEvent: inputEvent,
                });
              }
              privateFun.resetConf();
            };
            privateFun.resetConf = () => {
              delete vm.data.containerFocus;
              delete vm.data.showDropMenu;
              delete vm.data.textObj;
              delete vm.data.html;
              delete vm.data.style;
              delete vm.data.fnClick;
              delete vm.data.childStyle;
              delete vm.data.childs;
              delete vm.data.targetParentIndex;
              vm.otherObj = null;
              ($scope.$root && $scope.$root.$$phase) || $scope.$apply();
            };
            vm.fnChangeChildsBlockDisplay = (inputIsDisplay, inputEvent, inputOpts) => {
              if (inputIsDisplay) {
                const tmpVal = vm.data.textObj[inputOpts.target];
                vm.data.childStyle = {
                  top: `${inputOpts.index * 30}px`,
                };
                if (tmpVal.childs && tmpVal.childs.length > 0) {
                  vm.data.childs = tmpVal.childs;
                  vm.data.targetParentIndex = inputOpts.index;
                } else {
                  delete vm.data.childs;
                  delete vm.data.targetParentIndex;
                }
              } else {
                const tmpIsChild = inputEvent
                  ? privateFun.getTargetValue(inputEvent.toElement || inputEvent.relatedTarget, 'target') === 'child'
                  : false;
                if (!tmpIsChild) {
                  delete vm.data.childs;
                  delete vm.data.childStyle;
                  delete vm.data.targetParentIndex;
                }
              }
            };
            $scope.$watch(
              '$ctrl.otherObj',
              () => {
                if (!vm.otherObj) return;
                if (vm.otherObj.hasOwnProperty('target')) {
                  $scope.item = vm.otherObj.target;
                }
                if (vm.otherObj.hasOwnProperty('authority')) {
                  vm.authorityObject = vm.otherObj.authority;
                }
              },
              true
            );
            $element.prepend(
              $compile(
                '<div class="eo-drop-root eo_theme_iblock" ng-style="$ctrl.data.style" inner-html-common-directive html="$ctrl.data.html" ng-mousedown="$ctrl.fnWatchUi($event)" ng-if="$ctrl.data.showDropMenu"></div>'
              )($scope)
            );
          },
        ],
      };
    },
  ])
  /**
   * @tips 如果是通过$compile直接编译eo-drop-elem指令，会出现报错。需要手动在外部搭配eo-Drop-Root或eo-drop-elem包裹在ng-...全局指令上
   */
  .directive('eoDropElem', [
    '$rootScope',
    '$parse',
    function ($rootScope, $parse) {
      return {
        restrict: 'AE',
        scope: {
          fnClick: '&',
          textArr: '<',
          setting: '<',
        },
        require: '?^eoDropRoot', // 依赖eoDropRoot指令
        link($scope, elem, attrs, $eoDropRoot) {
          // let privateFun={};
          // privateFun.getViewData = (inputEvent) => {
          //     if (inputEvent.offsetParent) {
          //         let tmpParentData = privateFun.getViewData(inputEvent.offsetParent);
          //         return {
          //             left: tmpParentData.left + inputEvent.offsetLeft,
          //             top: tmpParentData.top + inputEvent.offsetTop
          //         }
          //     }
          //     return {
          //         left: inputEvent.offsetLeft,
          //         top: inputEvent.offsetTop
          //     }
          // }
          elem.bind('click', (inputEvent) => {
            inputEvent.stopPropagation();
            $eoDropRoot.data.showDropMenu = true;
            $eoDropRoot.data.fnClick = $scope.fnClick;
            if (attrs.otherObj) {
              $eoDropRoot.otherObj = $parse(attrs.otherObj)($scope.$parent);
            }
            $eoDropRoot.data.textObj = {};
            let tmpHtml = '';
            const tmpTextArr = angular.copy($scope.textArr);
            let tmpHasChild;
            switch (typeof $scope.textArr) {
              case 'string': {
                tmpHtml = $scope.textArr;
                if (attrs.hasOwnProperty('mark')) {
                  tmpHtml = tmpHtml.replace('$_{mark}', attrs.mark);
                }
                break;
              }
              default: {
                for (const key in tmpTextArr) {
                  const val = tmpTextArr[key];
                  if (!val.hasOwnProperty('value') || ($scope.setting && $scope.setting.targetIsObj)) {
                    if (!val.hasOwnProperty('value')) val.value = key;
                    $eoDropRoot.data.textObj[val.value] = val;
                  }
                  if (val.childs && val.childs.length > 0) {
                    tmpHasChild = true;
                    tmpHtml += `<div class="${
                      val.class || ''
                    } had_child_item_edr item_edr text_omit lh_30 cp f_row f_js_ac" ng-mouseenter="$ctrl.fnChangeChildsBlockDisplay(true,$event,{target:${
                      val.value
                    },index:${key}})" ng-mouseleave="$ctrl.fnChangeChildsBlockDisplay(false,$event)"><span>${
                      val.key
                    }</span><span class="iconfont icon-chevron-right"></span></div>`;
                  } else {
                    tmpHtml += `<div class="${val.class || ''} item_edr text_omit lh_30 cp" $_child_mouseleave  ${
                      val.expression || ''
                    } ${val.hasOwnProperty('value') ? `eo-attr-value=${val.value}` : ''}>${val.key}</div>`;
                  }
                }

                break;
              }
            }
            if (tmpHasChild) {
              tmpHtml = tmpHtml.replace(
                /\$_child_mouseleave/g,
                'ng-mouseenter="$ctrl.fnChangeChildsBlockDisplay(false)"'
              );
              tmpHtml = `<div>${tmpHtml}</div><div class="childs_container_edr eo-block-container" target="child" ng-style="$ctrl.data.childStyle" ng-if="$ctrl.data.childs.length"><div target="child" ng-repeat="item in $ctrl.data.childs" class="item_edr text_omit lh_30 cp plr10" eo-attr-value="{{$index}}">{{item.key}}</div></div>`;
            } else {
              tmpHtml = tmpHtml.replace(/\$_child_mouseleave/g, '');
            }
            $eoDropRoot.data.html = tmpHtml;
            const tmpViewData = elem[0].getBoundingClientRect();
            const tmpTop = tmpViewData.height + 5;
            if (tmpViewData.left < 150) {
              $eoDropRoot.data.style = {
                left: `${tmpViewData.left}px`,
                top: `${tmpViewData.top + tmpTop}px`,
              };
            } else {
              $eoDropRoot.data.style = {
                right: `${document.body.clientWidth - tmpViewData.left - tmpViewData.width}px`,
                top: `${tmpViewData.top + tmpTop}px`,
              };
            }
            const targetTop = document.body.offsetHeight - tmpViewData.top;
            if (targetTop < 100 && targetTop > 0) {
              delete $eoDropRoot.data.style.top;
              $eoDropRoot.data.style.bottom = `${document.body.clientHeight - tmpViewData.top + 5}px`;
            }
            elem[0].focus();
            ($scope.$root && $scope.$root.$$phase) || $scope.$apply();
          });
          const privateFun = {};
          privateFun.resetConf = () => {
            if ($eoDropRoot.data.containerFocus) return;
            delete $eoDropRoot.data.containerFocus;
            delete $eoDropRoot.data.showDropMenu;
            delete $eoDropRoot.data.textObj;
            delete $eoDropRoot.data.html;
            delete $eoDropRoot.data.style;
            delete $eoDropRoot.data.fnClick;
            delete $eoDropRoot.data.childStyle;
            delete $eoDropRoot.data.childs;
            delete $eoDropRoot.data.targetParentIndex;
            $eoDropRoot.otherObj = null;
            ($scope.$root && $scope.$root.$$phase) || $scope.$apply();
          };
          elem.bind('blur', privateFun.resetConf);
        },
      };
    },
  ]);
