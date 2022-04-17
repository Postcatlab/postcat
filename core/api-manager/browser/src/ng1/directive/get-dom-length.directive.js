/**
 * 获取某一节点的数量
 * @param {string} bindClass 绑定监听类
 * @param {number} model 绑定视图数据
 */
angular.module('eolinker.directive').directive('getDomLengthCommonDirective', [
  '$rootScope',
  function ($rootScope) {
    return {
      restrict: 'A',
      scope: {
        model: '=',
      },
      link: function ($scope, elem, attrs, ngModel) {
        $scope.data = {
          domElemQuery: elem[0].getElementsByClassName(attrs.bindClass),
        };
        (function main() {
          $scope.$watch('data.domElemQuery.length', function () {
            $scope.model = $scope.data.domElemQuery.length;
          });
        })();
      },
    };
  },
]);
