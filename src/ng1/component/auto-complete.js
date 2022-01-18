/**
 * 产品基本需求
 * （1）单击下拉按钮，下拉菜单为全部选项内容
 * （2）编辑输入框，下拉菜单为筛选后的内容
 * （3）能够通过上下箭头控制下拉菜单选中项
 */
/**
 * @author EOAPI
 * @description 自动补全控件
 * @extends {string} placeholder 内置输入框placeholder内容[optional]
 * @extends {array} array 预设列表
 * @extends {string} model 输入框绑定对象
 * @extends {string} type 输入对象类型
 * @extends {function} inputChangeFun 输入框预设函数[optional]
 */

angular.module('eolinker').component('autoCompleteComponent', {
  template: `<div class="container_acac">
  <div class="po_re">
      <button type="button" ng-show="$ctrl.array.length" class="cp iconfont icon-chevron-down fs12"
          ng-click="$ctrl.fun.changeSwitch(!$ctrl.data.inputIsFocus)"></button>
      <input ng-trim="{{$ctrl.CONST.INPUT_DEFAULT_TRIM}}" type="text" maxlength="{{$ctrl.maxLength}}" autocomplete="off"
          placeholder="{{$ctrl.placeholder || ''}}"
          ng-class="{'eo-input-error':$ctrl.required&&!$ctrl.model[$ctrl.keyName]}" class="eo-input input-text-acac"
          ng-model="$ctrl.model[$ctrl.keyName]" ng-change="$ctrl.fun.modelChange()"
          ng-focus="$ctrl.fun.inputFocus($event)" ng-blur="$ctrl.fun.inputBlur($event)"
          ng-keydown="$ctrl.fun.keydown($event)" ng-disabled="$ctrl.readOnly">
  </div>
  <div ng-style="{left:$ctrl.data.inputX+'px',width:$ctrl.data.inputWidth+'px'}" class="list_container_acac"
      repaint-scroll-top-common-directive count="$ctrl.data.currentElementCount" min="4" l-height="20"
      ng-show="$ctrl.data.inputIsFocus&&$ctrl.data.query.length">
      <ul>
          <li class="item_acac" ng-repeat="item in $ctrl.data.query track by $index"
              ng-class="{'active_item_acac':$ctrl.data.currentElementCount===$index}"
              ng-mousedown="$ctrl.fun.changeText(item)">{{item}}</li>
      </ul>
  </div>
</div>`,
  controller: autoCompleteController,
  bindings: {
    readOnly: '<',
    placeholder: '@',
    keyName: '@',
    maxLength: '@',
    required: '<',
    inputBlurFun: '&',
    inputKeydownFun: '&',
    setting: '<',
    array: '<', //自定义数组填充数组
    model: '=', //输入框绑定
    inputChangeFun: '&', //输入框值改变绑定功能函数
  },
});

autoCompleteController.$inject = ['$scope', '$rootScope', '$element'];

function autoCompleteController($scope, $rootScope, $element) {
  var vm = this;
  vm.data = {
    query: [],
    inputElem: $element[0].getElementsByClassName('input-text-acac'),
    inputIsFocus: false,
  };
  vm.fun = {};
  vm.selectMainObject = {
    itemType: 'html',
    itemHtml: '{{item}}',
  };
  vm.CONST = {
    INPUT_DEFAULT_TRIM: true,
  };
  var data = {
      originalElemCount: 0,
    },
    privateFun = {};
  privateFun.resetWaitingList = () => {
    if (vm.model[vm.keyName]) {
      vm.data.query = [];
      let tmpIndex = 0;
      angular.forEach(vm.array, function (val, key) {
        var pattern = '/^' + vm.model[vm.keyName].toLowerCase() + '/';
        try {
          if (eval(pattern).test(val.toLowerCase())) {
            vm.data.query.splice(tmpIndex, 0, val);
            tmpIndex++;
          } else if (val.toLowerCase().indexOf(vm.model[vm.keyName].toLowerCase()) > -1) {
            vm.data.query.push(val);
          }
        } catch (EVAL_ERR) {
          console.error(EVAL_ERR);
        }
      });
      if (vm.data.query.length <= 0) {
        vm.data.viewIsShow = false;
      }
    } else {
      vm.data.query = vm.array;
    }
  };
  vm.fun.modelChange = function () {
    vm.data.inputIsFocus = true;
    vm.inputChangeFun();
    privateFun.clearSelectItem();
    privateFun.resetWaitingList();
  };
  privateFun.setDownListWidth = () => {
    if (vm.setting && vm.setting.isNeedToResetPosition) {
      let tmpObj = $element[0].getElementsByClassName('input-text-acac')[0].offsetParent || {};
      vm.data.inputWidth = tmpObj.clientWidth - 2;
      vm.data.inputX = tmpObj.x;
    }
  };
  vm.fun.changeSwitch = function (inputBool) {
    if (vm.readOnly) return;
    vm.data.inputIsFocus = inputBool;
    if (vm.data.inputIsFocus) {
      privateFun.setDownListWidth();
      vm.data.query = vm.array;
    }
    vm.data.inputElem[0].focus();
  };
  vm.fun.changeText = function (inputText) {
    vm.data.inputIsFocus = false;
    vm.model[vm.keyName] = inputText;
    vm.inputChangeFun();
  };

  /**
   * @description 重置下拉菜单选中项
   */
  privateFun.clearSelectItem = () => {
    data.originalElemCount = 0;
    vm.data.currentElementCount = data.originalElemCount - 1;
  };
  vm.fun.inputBlur = ($event) => {
    $event.stopPropagation();
    vm.data.inputIsFocus = false;
    if (vm.inputBlurFun) {
      vm.inputBlurFun();
    }
  };
  vm.fun.inputFocus = ($event) => {
    $event.stopPropagation();
    privateFun.clearSelectItem();
  };
  vm.fun.keydown = function (_default) {
    if (!vm.data.hasOwnProperty('currentElementCount')) {
      vm.data.currentElementCount = data.originalElemCount - 1;
    }

    switch (_default.keyCode) {
      case 38: {
        // up
        vm.data.currentElementCount =
          vm.data.currentElementCount <= data.originalElemCount
            ? ((vm.data.query || []).length || 1) - 1
            : vm.data.currentElementCount - 1;
        ($scope.$root && $scope.$root.$$phase) || $scope.$apply();
        break;
      }
      case 40: {
        // down
        _default.preventDefault();
        vm.data.currentElementCount++;
        if (vm.data.currentElementCount === (vm.data.query || []).length) {
          vm.data.currentElementCount = data.originalElemCount;
        }
        ($scope.$root && $scope.$root.$$phase) || $scope.$apply();
        break;
      }
      case 13: {
        //enter
        _default.preventDefault();
        if (vm.data.currentElementCount >= 0) {
          vm.fun.changeText(vm.data.query[vm.data.currentElementCount], vm.data.currentElementCount);
          ($scope.$root && $scope.$root.$$phase) || $scope.$apply();
        }
      }
    }
    if (vm.inputKeydownFun) {
      vm.inputKeydownFun({
        $event: _default,
        changeText: vm.fun.modelChange,
      });
    }
  };
  $scope.$on('$destroy', () => {
    $scope.$destroy();
    $element.remove();
    vm = null;
    indexController = null;
  });
  vm.$onInit = () => {
    privateFun.setDownListWidth();
    if (vm.setting && vm.setting.refleshWaitingList) {
      $scope.$watch('$ctrl.array', function () {
        if (vm.array) {
          privateFun.resetWaitingList();
        }
      });
    }
  };
}
