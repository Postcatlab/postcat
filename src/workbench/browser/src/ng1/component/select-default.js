/**
 * @author Eoapi
 * @description 默认下拉菜单
 */

angular.module('eolinker').component('selectDefaultCommonComponent', {
  template: `<!-- 下拉框 -->
  <div class="container-div" ng-if="$ctrl.type==='default'" ng-click="$ctrl.fun.domClick($event)"
      ng-class="{'container-focus':$ctrl.data.containerFocus,'multiple_select':$ctrl.multiple==='true'}">
      <div class="po_re">
          <p class="text-p preview-text-p f_row_ac f_js" ng-class="{'disabled_preview_text_p':$ctrl.disabled}"
              eo-attr-tip-placeholder="{{$ctrl.input.attrPlaceholder}}">
              <span ng-show="$ctrl.data.text">{{$ctrl.data.text}}</span>
              <span class="eo-status-tips"
                  ng-if="!$ctrl.data.text">{{$ctrl.mainObject.setting.emptyText||'请选择...'}}</span>
              <span class="iconfont icon-chevron-down arrow-span"
                  ng-hide="$ctrl.mainObject.hideArrow||$ctrl.data.text&&!$ctrl.required"></span>
              <button type="button" class="iconfont icon-guanbi fs16 z_index2" ng-mousedown="$ctrl.fun.clear($event)"
                  ng-show="$ctrl.mainObject.allowClear||!$ctrl.required&&!$ctrl.disabled&&$ctrl.data.text"></button>
          </p>
          <input class="input-text text-p opacity-text-input input-select" ng-mousedown="$ctrl.fun.inputMousedown($event)"
              eo-attr-tip-placeholder="{{$ctrl.input.attrPlaceholder}}" readonly ng-disabled="$ctrl.disabled">
      </div>
      <div ng-style="{left:$ctrl.data.inputX+'px',top:$ctrl.data.inputY+'px'}" class="list-container-div" ng-mouseleave="$ctrl.data.containerFocus=false;" ng-if="$ctrl.input.query.length>0"
          ng-mousedown="$ctrl.fun.listMouseDown($event)" ng-class="{'dp_b':$ctrl.data.searchFocusStatus}">
          <p class="search-p bbd f_row f_ac" ng-if="$ctrl.input.query.length>=5">
              <span ng-if="$ctrl.multiple==='true'" class="sd_all_check_box sd_check_box iconfont square_checkbox fwb cg cp"
                  ng-class="{'icon-duihao':$ctrl.data.batch.selectAll}"></span>
              <span class="iconfont icon-sousuo"></span>
              <input class="input-search fg1" type="text" autocomplete="off" ng-model="$ctrl.data.q" placeholder="搜索"
                  ng-change="$ctrl.fun.searchChange()" ng-mousedown="$ctrl.fun.searchActiveStatus(true)"
                  ng-blur="$ctrl.fun.searchActiveStatus(false)">
          </p>
          <inner-html-common-directive html="$ctrl.data.pulldownHtml">
          </inner-html-common-directive>
      </div>
      <div class="list-container-div" ng-if="$ctrl.input.query.length==0">
          <p class="un-search-response-p eo-status-tips">暂无任何选项</p>
      </div>
  </div>
  <!-- 平铺选择框 -->
  <inner-html-common-directive class="tile_container_div f_wrap"
      ng-class="{'f_row_ac':$ctrl.mainObject.direction!=='column','f_column':$ctrl.mainObject.direction==='column'}"
      ng-if="$ctrl.type==='tile'" ng-click="$ctrl.fun.listMouseDown($event)" html="$ctrl.data.tileHtml">
  </inner-html-common-directive>
  <div class="tab-focus-div eo-static-hidden" tabindex="0" ng-focus="$ctrl.fun.divFocus()"></div>`,
  bindings: {
    input: '<',
    type: '@', // 下拉框、平铺
    output: '=',
    required: '@',
    multiple: '@', // 如果为true的时候，不能用null值作为空白
    modelKey: '@',
    inputChangeFun: '&',
    disabled: '<',
    disabledQuery: '<',
    mainObject: '<',
  },
  controller: selectDefaultController,
});

selectDefaultController.$inject = ['$scope', '$element'];

function selectDefaultController($scope, $element) {
  let vm = this;
  vm.data = {
    batch: {
      selectAll: false,
      indexAddress: {},
    },
    text: '',
    query: null,
    searchInputElem: null,
    inputElem: $element[0].getElementsByClassName('input-select'),
    q: '',
  };
  vm.fun = {};
  const fun = {};
  const data = {
    hasSelectAlready: false,
    originalElemCount: 0,
    output: '',
    watchOutput: null,
    hasInitial: false,
  };
  vm.fun.inputMousedown = function ($event) {
    if ($event) $event.stopPropagation();

    if (vm.mainObject && vm.mainObject.isNeedToResetPosition) {
      let tmpObj = vm.data.inputElem[0].getBoundingClientRect();
      vm.data.inputX = tmpObj.x;
      vm.data.inputY = tmpObj.y + 30;
    }

    vm.data.currentElementCount = data.originalElemCount - 1;
    vm.data.q = '';
    vm.data.query = vm.input.query;
    if (vm.multiple === 'true') {
      fun.resetSelectAll();
    }
  };
  vm.fun.searchChange = function () {
    const tmpQuery = angular.copy(vm.input.query);
    vm.data.currentElementCount = data.originalElemCount;
    if (!vm.data.q) {
      vm.data.query = tmpQuery;
    } else {
      vm.data.query = tmpQuery.filter((val, key) => {
        if ((val[vm.input.key] || '').toLowerCase().indexOf((vm.data.q || '').toLowerCase()) > -1) {
          return val;
        } else {
          return undefined;
        }
      });
    }
    if (vm.multiple === 'true') {
      fun.resetSelectAll();
    }
  };
  vm.fun.divFocus = function () {
    vm.fun.inputMousedown();
    vm.data.inputElem[0].focus();
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
        if (vm.data.currentElementCount == data.originalElemCount) {
          if (vm.data.searchInputElem) {
            vm.data.searchFocusStatus = true;
            vm.data.searchInputElem[0].click();
            vm.data.searchInputElem[0].focus();
            // return;
          }
        } else if (vm.data.currentElementCount == 4) {
          vm.data.inputElem[0].focus();
        }
        ($scope.$root && $scope.$root.$$phase) || $scope.$apply();
        break;
      }
      case 40: {
        // down
        _default.preventDefault();
        vm.data.currentElementCount++;
        if (vm.data.currentElementCount == (vm.data.query || []).length) {
          vm.data.currentElementCount = data.originalElemCount;
        }
        if (vm.data.currentElementCount == data.originalElemCount) {
          if (vm.data.searchInputElem) {
            vm.data.searchFocusStatus = true;
            vm.data.searchInputElem[0].click();
            vm.data.searchInputElem[0].focus();
            // return;
          }
        } else if (vm.data.currentElementCount == 0) {
          vm.data.inputElem[0].focus();
        }

        ($scope.$root && $scope.$root.$$phase) || $scope.$apply();
        break;
      }
      case 13: {
        // enter
        _default.preventDefault();
        if (vm.data.currentElementCount >= 0) {
          let tmpQuery;
          if (vm.mainObject && vm.mainObject.fnFilterArr) {
            tmpQuery = vm.data.query.filter(vm.mainObject.fnFilterArr);
          } else {
            tmpQuery = vm.data.query;
          }
          fun.select(tmpQuery[vm.data.currentElementCount], vm.data.currentElementCount);
          if (vm.multiple !== 'true') {
            vm.data.inputElem[0].blur();
          }
          ($scope.$root && $scope.$root.$$phase) || $scope.$apply();
        }
        return false;
      }
    }
  };
  fun.setText = () => {
    vm.data.text = '';
    if (vm.multiple === 'true') {
      const tmpText = [];
      const queryLen = vm.input.query.length;
      for (let index = 0; index < queryLen; index++) {
        const item = vm.input.query[index];
        if (vm.data.batch.indexAddress[item[vm.input.value]]) {
          tmpText.push(item[vm.input.key]);
        }
      }
      fun.resetSelectAll();
      vm.data.text = tmpText.join(',');
    } else {
      for (const key in vm.input.query) {
        const val = vm.input.query[key];
        // 误轻易改为===
        if (vm.output && vm.output[vm.modelKey] == val[vm.input.value]) {
          vm.data.text = val[vm.input.key];
          break;
        }
      }
    }
  };

  fun.setValue = (arg) => {
    if (vm.multiple === 'true') {
      if (vm.data.batch.indexAddress[arg[vm.input.value]]) {
        if (vm.required && !(Object.keys(vm.output[vm.modelKey]).length > 1)) return;
        vm.output[vm.modelKey].splice(
          vm.output[vm.modelKey].findIndex((id) => id === arg[vm.input.value]),
          1
        );
        delete vm.data.batch.indexAddress[arg[vm.input.value]];
      } else {
        vm.output[vm.modelKey].push(arg[vm.input.value]);
        vm.data.batch.indexAddress[arg[vm.input.value]] = 1;
      }
      if (vm.inputChangeFun) {
        const fnParams = {
          value: arg[vm.input.value],
          type: vm.data.batch.indexAddress[arg[vm.input.value]] ? 'select' : 'cancel',
        };
        vm.inputChangeFun({
          arg: fnParams,
        });
      }
    } else if (vm.output[vm.modelKey] !== arg[vm.input.value]) {
      if (vm.mainObject && vm.mainObject.fnCheckIsValid) {
        vm.mainObject.fnCheckIsValid(
          vm.output[vm.modelKey],
          arg[vm.input.value],
          (tmpInputIsValid) => {
            if (tmpInputIsValid) vm.output[vm.modelKey] = arg[vm.input.value];
          },
          vm.otherObject
        );
      } else {
        vm.output[vm.modelKey] = arg[vm.input.value];
      }
      if (vm.inputChangeFun) {
        vm.inputChangeFun({ arg });
      }
    } else if (vm.mainObject && !vm.required) {
      vm.output[vm.modelKey] = null;
      if (vm.inputChangeFun) {
        vm.inputChangeFun();
      }
    }
    fun.setText();
  };
  vm.fun.clear = function ($event) {
    data.hasSelectAlready = true;
    $event.stopPropagation();
    if (vm.multiple === 'true') {
      vm.output[vm.modelKey] = [];
      vm.data.batch.indexAddress = {};
    } else {
      vm.output[vm.modelKey] = undefined;
    }
    vm.data.text = '';
    if (vm.inputChangeFun) {
      vm.inputChangeFun({});
    }
  };
  fun.select = function (arg) {
    if ((vm.disabledQuery && vm.disabledQuery.indexOf(arg[vm.input.value]) > -1) || vm.disabled) return;
    data.hasSelectAlready = true;
    data.output = data.output || [];
    // arg.index = vm.input.index;注释，编写原因未知，影响多选组件
    if (
      vm.mainObject.checkIsValidFun &&
      !vm.mainObject.checkIsValidFun(arg, () => {
        fun.setValue(arg);
      })
    )
      return;
    fun.setValue(arg);
  };
  fun.resetSelectAll = () => {
    if (!vm.data.query) return;
    if (
      (vm.output[vm.modelKey] && vm.output[vm.modelKey].length < vm.data.query.length) ||
      vm.data.query.length === 0
    ) {
      vm.data.batch.selectAll = false;
    } else {
      let tmpSelectAll = true;
      const queryLen = vm.data.query.length;
      for (let index = 0; index < queryLen; index++) {
        const item = vm.data.query[index];
        if (!vm.data.batch.indexAddress[item[vm.input.value]]) {
          tmpSelectAll = false;
          break;
        }
      }
      vm.data.batch.selectAll = tmpSelectAll;
    }
  };
  fun.selectAll = () => {
    data.hasSelectAlready = true;
    if (vm.data.batch.selectAll) {
      if (vm.required) {
        vm.output[vm.modelKey] = [vm.data.query[0][vm.input.value]];
        vm.data.batch.indexAddress = {};
        vm.data.batch.indexAddress[vm.data.query[0][vm.input.value]] = 1;
      } else if (!vm.data.q) {
        vm.output[vm.modelKey] = [];
        vm.data.batch.indexAddress = {};
      } else {
        for (let key = 0; key < vm.data.query.length; key++) {
          const item = vm.data.query[key];
          vm.output[vm.modelKey].splice(
            vm.output[vm.modelKey].findIndex((id) => id === item[vm.input.value]),
            1
          );
          delete vm.data.batch.indexAddress[item[vm.input.value]];
        }
      }
    } else {
      // 避免监听output重复渲染
      const valueArr = [];
      for (let key = 0; key < vm.data.query.length; key++) {
        const val = vm.data.query[key];
        valueArr.push(val[vm.input.value]);
        if (!vm.data.batch.indexAddress[val[vm.input.value]]) {
          vm.data.batch.indexAddress[val[vm.input.value]] = 1;
        }
      }
      vm.output[vm.modelKey] = valueArr;
    }
    if (vm.inputChangeFun) {
      vm.inputChangeFun();
    }
    fun.setText();
  };
  vm.fun.domClick = (inputEvent) => {
    inputEvent.stopPropagation();
  };
  fun.getTargetIndex = function ($event, inputPointAttr) {
    if (!$event.getAttribute) return -1;
    const itemIndex = $event.getAttribute(inputPointAttr || 'eo-attr-index');
    if (itemIndex) {
      return itemIndex;
    } else {
      return fun.getTargetIndex($event.parentNode, inputPointAttr);
    }
  };
  vm.fun.listMouseDown = function ($event) {
    $event.stopPropagation();
    const template = {};
    try {
      template.point = $event.target.classList[0];
    } catch (e) {
      template.point = 'default';
    }
    switch (template.point) {
      case 'input-search': {
        break;
      }
      case 'select-btn-item':
      case 'item_text':
      case 'sd_check_box':
      default: {
        if (vm.multiple === 'true') {
          vm.data.containerFocus = true;
        }
        template.index = fun.getTargetIndex($event.target, 'eo-attr-index');
        if (template.index === -1) return;
        let tmpQuery;
        if (vm.mainObject.fnFilterArr) {
          tmpQuery = vm.data.query.filter(vm.mainObject.fnFilterArr);
        } else {
          tmpQuery = vm.data.query;
        }
        fun.select(tmpQuery[template.index]);
        break;
      }
      case 'sd_all_check_box': {
        vm.data.containerFocus = true;
        fun.selectAll();
        break;
      }
    }
  };
  vm.fun.searchActiveStatus = function (inputFocusStatus) {
    vm.data.searchFocusStatus = inputFocusStatus;
  };
  fun.initial = function () {
    data.hasInitial = true;
    if (vm.multiple === 'true') {
      if (vm.input.initialData) vm.output[vm.modelKey] = angular.copy(vm.input.initialData);
      vm.data.batch.indexAddress = {};
      if (vm.output[vm.modelKey] && vm.output[vm.modelKey].length) {
        angular.forEach(vm.output[vm.modelKey], (val, key) => {
          vm.data.batch.indexAddress[val] = 1;
        });
      } else if (vm.mainObject.isSelectAll) {
        const valueArr = [];
        for (let key = 0; key < vm.data.query.length; key++) {
          const val = vm.data.query[key];
          valueArr.push(val[vm.input.value]);
          if (!vm.data.batch.indexAddress[val[vm.input.value]]) {
            vm.data.batch.indexAddress[val[vm.input.value]] = 1;
          }
        }
        vm.output[vm.modelKey] = valueArr;
      }
    } else {
      for (const key in vm.data.query) {
        const val = vm.data.query[key];
        if (val[vm.input.value] == vm.input.initialData) {
          vm.output = vm.output || {};
          vm.output[vm.modelKey] = val[vm.input.value];
          if (vm.mainObject && vm.mainObject.watchInitialInputChange && vm.inputChangeFun) {
            vm.inputChangeFun({
              arg: val,
            });
          }
          break;
        }
      }
    }
    fun.setText();
  };
  $scope.$watch(
    '$ctrl.input.query',
    () => {
      if (!vm.input.query) return;
      vm.data.query = vm.input.query;
      if (vm.data.query.length >= 5 || vm.multiple === 'true') {
        data.originalElemCount = -1;
        vm.data.searchInputElem = $element[0].getElementsByClassName('input-search');
      } else {
        data.originalElemCount = 0;
      }
      fun.initial();
    },
    true
  );
  const watchInitial = $scope.$watch(
    '$ctrl.input.initialData',
    () => {
      if (!vm.input.query || vm.input.initialData === undefined) return;
      if (vm.multiple === 'true' && data.hasSelectAlready && !vm.input.keepWatchInitialData) {
        watchInitial();
        return;
      }
      fun.initial();
    },
    true
  );

  fun.initHtml = () => {
    let itemHtml = '';
    const deafultText = `<span class="item_text text_omit">{{item.${vm.input.key}}}</span>`;
    switch (vm.mainObject.itemType) {
      case 'html': {
        itemHtml = vm.mainObject.itemHtml;
        itemHtml = itemHtml.replace('${eo_default_text}', deafultText);
        break;
      }
      case 'text': {
        itemHtml = deafultText;
        break;
      }
    }
    const judgeHtml = vm.multiple
      ? `$ctrl.data.batch.indexAddress[item.${vm.input.value}]`
      : `$ctrl.output[$ctrl.modelKey]==item.${vm.input.value}`;
    const quoteType = {
      square: `<span class="sd_check_box square_checkbox iconfont  fwb cg" ng-class="{'icon-duihao':${judgeHtml}}"></span>`,
      round: `<span class="sd_check_box iconfont fs24 mr5" ng-class="{'icon-danxuanxuanzhong':${judgeHtml},'icon-danxuanweixuanzhong':!(${judgeHtml})}"></span>`,
    };
    let checkboxHtml = '';
    if (vm.mainObject.showCheckbox) {
      checkboxHtml = quoteType[vm.mainObject.checkboxType];
    }
    switch (vm.type) {
      case 'tile': {
        vm.data.tileHtml = `<button type="button" class="select-btn-item common_class_tile_item  f_row_ac f_wrap ${
          vm.mainObject.itemClass || ''
        }"
                    ${vm.mainObject.itemExpression || ''} 
                   ng-class="{'select-active-item':${
                     vm.multiple
                       ? '$ctrl.data.batch.indexAddress[item[$ctrl.input.value]]'
                       : '$ctrl.output[$ctrl.modelKey]==item[$ctrl.input.value]'
                   },'disabled_tile_btn_sdcc':$ctrl.disabled||$ctrl.disabledQuery.indexOf(item[$ctrl.input.value])>-1,${
          vm.mainObject.otherNgClass || ''
        }}"
                   ng-repeat="item in $ctrl.data.query" eo-attr-index="{{$index}}">
               ${checkboxHtml}${itemHtml}
           </button>`;
        break;
      }
      default: {
        vm.data.pulldownHtml = `<div class="query-container-child-div" repaint-scroll-top-common-directive
                    count="$ctrl.data.currentElementCount" min="5" l-height="35">
                    <p class="eo-none-tr tac" ng-show="($ctrl.data.query|filter:$ctrl.mainObject.fnFilterArr).length==0">暂无任何搜索项
                    </p>
                    <p class="select-btn-item common-class-item f_row f_ac f_wrap" ng-show="($ctrl.data.query|filter:$ctrl.mainObject.fnFilterArr).length>0"
                    ${vm.mainObject.itemExpression || ''} 
                        ng-class="{'select-active-item':$ctrl.data.currentElementCount==$index,${
                          vm.mainObject.otherNgClass || ''
                        }}"
                        ng-repeat="item in $ctrl.data.query|filter:$ctrl.mainObject.fnFilterArr" eo-attr-index="{{$index}}">
                        ${checkboxHtml}
                        ${itemHtml}
                    </p>
                </div>`;
        break;
      }
    }
  };

  vm.$onInit = function () {
    vm.modelKey = vm.modelKey || 'value';
    vm.type = vm.type || 'default';
    $element.bind('keydown', vm.fun.keydown);
    vm.mainObject = vm.mainObject || {};
    if (vm.mainObject.initFun) {
      vm.mainObject.initFun();
    }
    vm.mainObject.setting = vm.mainObject.setting || {};
    vm.mainObject.itemType = vm.mainObject.itemType || 'text';
    if ((vm.type === 'tile' || vm.multiple === 'true') && !vm.mainObject.hasOwnProperty('showCheckbox')) {
      vm.mainObject.showCheckbox = true;
    }
    if (!vm.mainObject.hasOwnProperty('checkboxType')) {
      if (vm.multiple) {
        vm.mainObject.checkboxType = 'square';
      } else {
        vm.mainObject.checkboxType = 'round';
      }
    }
    if (vm.multiple === 'true') {
      // 非初始化，外部改变值
      $scope.$watch(
        '$ctrl.input.changeFlag',
        () => {
          if (!vm.input.changeFlag || !vm.input.query || vm.input.initialData === undefined) return;
          fun.initial();
        },
        true
      );
    }
    fun.initHtml();
  };
  $scope.$on('$destroy', () => {
    $scope.$destroy();
    $element.remove();
    vm = null;
    indexController = null;
  });
}
