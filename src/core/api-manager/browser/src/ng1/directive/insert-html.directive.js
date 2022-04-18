angular
  .module('eolinker.directive')
  .directive('insertHtmlCommonDirective', [
    '$compile',
    '$rootScope',
    function ($compile, $rootScope) {
      return {
        restrict: 'AE',
        scope: {
          bindFun: '&',
        },
        link: function ($scope, elem, attrs, ctrl) {
          var CONST = {
              HTML: document
                .getElementById(attrs.templateId)
                .innerHTML.replace(/-{-/g, '{{')
                .replace(/-}-/g, '}}')
                .replace(/{eoData}/g, 'ng'),
            },
            data = {
              hasDocument: false,
            },
            fun = {};
          fun.bindFun = function ($event) {
            var tmpBindFunBool = $scope.bindFun();
            switch (typeof tmpBindFunBool) {
              case 'object': {
                if (tmpBindFunBool.throw == 'needToStopEvent') $event.stopPropagation();
                if (!tmpBindFunBool.valid || data.hasDocument) {
                  $event.stopPropagation();
                  return;
                }
                break;
              }
              default: {
                if (!tmpBindFunBool || data.hasDocument) {
                  return;
                }
                break;
              }
            }

            data.hasDocument = true;
            try {
              elem[attrs.insertType || 'append']($compile(CONST.HTML)($scope.$parent));
            } catch (e) {
              elem[attrs.insertType || 'append']($compile('<div>' + CONST.HTML + '</div>')($scope.$parent));
            }
          };
          fun.init = (function () {
            elem.bind(attrs.operateMark || 'click', fun.bindFun);
          })();
        },
      };
    },
  ]);
