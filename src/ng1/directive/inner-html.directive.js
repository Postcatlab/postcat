/*
 * author：广州银云信息科技有限公司
 * 注入HTML指令js
 * @require {string} html 所需注入的代码
 * @param {string} status 注入代码类型，默认绑定angular元素，若关闭状态为unbind-angular
 */
angular
  .module("eolinker.directive")
  .directive("innerHtmlCommonDirective", [
    "$compile",
    function ($compile) {
      return {
        restrict: "AE",
        scope: {
          html: "<",
          innerHtmlCommonDirective: "@",
        },
        link: function ($scope, elem, attrs, ctrl) {
          let _Dom;
          $scope.$watch(
            attrs.html ? "html" : "innerHtmlCommonDirective",
            function () {
              var template = {
                html: attrs.html
                  ? $scope.html
                  : $scope.innerHtmlCommonDirective,
                elemFunName: "append",
              };
              if (!template.html) {
                if (attrs.defaultHtml) {
                  elem.empty();
                  elem[template.elemFunName](attrs.defaultHtml);
                }
                if (!attrs.allowEmpty) return;
              }
              if (attrs.remove) elem.empty();
              if (attrs.position == "front") {
                template.elemFunName = "prepend";
              }
              switch (attrs.status) {
                case "unbind-angular": {
                  elem[template.elemFunName](template.html);
                  break;
                }
                default: {
                  try {
                    _Dom = $compile(template.html)($scope.$parent);
                  } catch (CONSTRUCT_DOM_ERR) {
                    _Dom = $compile("<span>" + template.html + "</span>")(
                      $scope.$parent
                    );
                  }
                  elem[template.elemFunName](_Dom);
                  break;
                }
              }
            }
          );
          $scope.$on("$destroy", () => {
            $scope.$destroy();
            $scope = null;
            if (_Dom) _Dom.remove();
            if (elem) elem.remove();
          });
        },
      };
    },
  ]);
