/**
 * @description 复制指令
 * @param [string][optional] copyModel 复制绑定模块
 * @param [string][optional] cacheVariable 复制缓存绑定，用于大数据不方便页面交互行数据
 * @extends $rootScope
 */

angular.module('eolinker').directive('copyCommonDirective', [
  '$rootScope',
  function ($rootScope) {
    return {
      restrict: 'A',
      scope: {
        copyModel: '<',
        text: '@',
        mainObj: '<',
        fnPrefix: '&',
      },
      link: function ($scope, elem, attrs, ctrl) {
        var data = {
            elem: null,
          },
          fun = {};
        fun.btnFun = function ($event) {
          $event.stopPropagation();
          let tmpText =
              $scope.text || $scope.copyModel || '',
            tmpFnTetx;
          if ($scope.fnPrefix) {
            tmpFnTetx = $scope.fnPrefix({
              text: tmpText,
            });
          }
          data.elem.value = tmpFnTetx || tmpText;
          data.elem.select();
          data.elem.click();
          try {
            if (document.execCommand('copy')) {
              if ($scope.mainObj && $scope.mainObj.successCallback) {
                $scope.mainObj.successCallback();
              } else {
                $rootScope.InfoModal({ tip: '复制成功', timeout: 1000, isCustomTitle: true }, 'success');
              }
            } else {
              if ($scope.mainObj && $scope.mainObj.failureCallback) {
                $scope.mainObj.failureCallback();
              } else {
                $rootScope.InfoModal('复制失败', 'error');
              }
            }
          } catch (err) {
            if ($scope.mainObj && $scope.mainObj.failureCallback) {
              $scope.mainObj.failureCallback();
            } else {
              $rootScope.InfoModal('复制失败', 'error');
            }
          }
        };
        fun.init = (function () {
          data.elem = document.getElementById('template_textarea_js') || document.createElement('textarea');
          data.elem.setAttribute('style', 'position:fixed,left:0,top:0,opacity:0;height:0;width:0;');
          data.elem.setAttribute('id', 'template_textarea_js');
          document.body.appendChild(data.elem);
          elem.bind(attrs.buttonFunction || 'click', fun.btnFun);
        })();
      },
    };
  },
]);
