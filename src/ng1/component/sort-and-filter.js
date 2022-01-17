/**
 * @author 广州银云信息科技有限公司
 * @description 排序和筛选
 */
angular.module('eolinker').component('sortAndFilterListDefaultComponent', {
  template: `<div class="f_row_ac" ng-hide="$ctrl.otherObj.isBatch">
  <div
    class="po_re eo-more-btn-container container_scfldc"
    ng-if="$ctrl.mainObj.canFilter||$ctrl.mainObj.canSort||$ctrl.mainObj.canAutomaticSort"
  >
    <button
      type="button"
      ng-disabled="$ctrl.mainObj.disabled"
      class="eo_more_btn btn_more_safldc iconfont icon-menu-down"
      fn-click="$ctrl.fun.opr(target)"
      eo-drop-elem
      other-obj="$ctrl.data"
      text-arr="$ctrl.dropMenuObj.html"
      ng-class="{'active_btn_more_safldc':!$ctrl.data.cacheFilter.selectAll&&$ctrl.mainObj.canFilter&&$ctrl.mainObj.filterArr.length>0}"
      ng-mousedown="$ctrl.fun.opr('focusFilter')"
    ></button>
  </div>
</div>
`,
  controller: sortAndFitlerController,
  bindings: {
    mainObj: '<',
    sortFun: '&',
    filterFun: '&',
    otherObj: '<',
  },
});

sortAndFitlerController.$inject = ['$rootScope', '$templateCache', '$scope'];

function sortAndFitlerController($rootScope, $templateCache, $scope) {
  var vm = this;
  vm.fun = {};
  vm.data = {
    activeObj: {
      indexAddress: {},
      query: [],
    },
    cacheFilter: {},
  };
  vm.dropMenuObj = {};
  let CONST = {
      DROP_MENU_HTML: $templateCache.get('app/component/common/list/default/sortAndFilter/index.tmp.html'),
    },
    cache = {};
  vm.data.changeFilter = () => {
    vm.data.list = cache.list.filter((val) => {
      if (!vm.data.keyword) return val;
      for (let tmpKey in val) {
        if (
          (tmpKey === 'key' || vm.mainObj.filterHtml.indexOf(tmpKey) > -1) &&
          typeof val[tmpKey] === 'string' &&
          val[tmpKey].toLowerCase().indexOf(vm.data.keyword.toLowerCase()) > -1
        )
          return val;
      }
      return undefined;
    });
  };
  vm.fun.opr = (inputOpr) => {
    switch (inputOpr) {
      case 'desc': {
        vm.sortFun({
          arg: 0,
        });
        break;
      }
      case 'asc': {
        vm.sortFun({
          arg: 1,
        });
        break;
      }
      case 'filter': {
        vm.data.cacheFilter = angular.copy(vm.data.activeObj);
        let tmpActiveObj = angular.copy(vm.data.activeObj);
        vm.data.cacheFilter.selectAll = tmpActiveObj.selectAll = vm.data.activeObj.query.length === cache.list.length;
        vm.filterFun({
          arg: tmpActiveObj,
        });
        break;
      }
      case 'focusFilter': {
        if (vm.mainObj.fnInit) {
          vm.mainObj.filterArr = vm.mainObj.fnInit();
        }
        vm.data.keyword = null;
        vm.dropMenuObj.html = CONST.DROP_MENU_HTML.replace(/\$_canSort/g, vm.mainObj.canSort)
          .replace(/\$_class/g, vm.mainObj.class || 'w_150')
          .replace(/\$_canAutomaticSortOrFilter/g, vm.mainObj.canFilter || vm.mainObj.canAutomaticSort)
          .replace(/\$_canSearch/g, vm.mainObj.filterArr && vm.mainObj.filterArr.length >= 5 ? true : false);
        cache.list = vm.data.list = vm.mainObj.filterArr;
        if (!vm.data.cacheFilter.indexAddress) vm.data.cacheFilter = angular.copy(vm.data.activeObj);
        else {
          for (let key in vm.data.activeObj) {
            vm.data.activeObj[key] = angular.copy(vm.data.cacheFilter[key]);
          }
        }
        vm.data.activeObj.isOperating = true;
        break;
      }
      default: {
        if (/^sort_/.test(inputOpr)) {
          vm.sortFun({
            arg: inputOpr.split('sort_')[1],
          });
        }
        break;
      }
    }
  };
  vm.$onInit = () => {
    if (vm.mainObj.canFilter) {
      vm.data.listBlockConf = {
        setting: {
          isValidToBeNull: true,
          checkboxKeyIsNum: vm.mainObj.hasOwnProperty('checkboxKeyIsNum') ? vm.mainObj.checkboxKeyIsNum : true,
        },
        tdList: [
          {
            type: 'checkbox',
            activeKey: vm.mainObj.canFilterValue || 'value',
            isWantedToExposeObject: true,
            wantToWatchListLength: true,
            checkboxClickAffectTotalItem: true,
          },
          {
            type: 'html',
            html: vm.mainObj.filterHtml,
            thKey: `<span>筛选项</span><button class="eo-operate-btn pull-right" type="button" eo-attr-value="filter" ng-disabled="!$ctrl.activeObject.query.length">确定</button>`,
          },
        ],
        baseFun: {
          selectAll: (tmpInputBool) => {
            let tmpKey = vm.mainObj.canFilterValue || 'value';
            if (tmpInputBool) {
              vm.data.list.map((val) => {
                let tmpVal = val[tmpKey];
                if (!vm.data.activeObj.indexAddress[tmpVal]) vm.data.activeObj.indexAddress[tmpVal] = 1;
                if (vm.data.activeObj.query.indexOf(tmpVal) === -1) vm.data.activeObj.query.push(tmpVal);
              });
            } else {
              for (let key in vm.data.activeObj.indexAddress) {
                delete vm.data.activeObj.indexAddress[key];
              }
              vm.data.activeObj.query.splice(0, vm.data.activeObj.query.length);
            }
          },
        },
      };
      if (vm.mainObj.filterIndexAddress) {
        vm.data.activeObj.indexAddress = vm.mainObj.filterIndexAddress;
        return;
      }
      $scope.$watch('$ctrl.mainObj.filterArr', () => {
        if (vm.mainObj.filterArr && vm.mainObj.filterArr.length > 0) {
          vm.mainObj.filterArr.map((val) => {
            vm.data.activeObj.indexAddress[val[vm.mainObj.canFilterValue || 'value']] = 1;
            vm.data.activeObj.query.push(val[vm.mainObj.canFilterValue || 'value']);
          });
          vm.data.activeObj.selectAll = true;
          vm.data.cacheFilter.selectAll = true;
        }
      });
    } else if (vm.mainObj.canAutomaticSort) {
      vm.data.listBlockConf = {
        setting: {
          trExpression: `eo-attr-value="sort_{{item.value}}"`,
        },
        tdList: [
          {
            type: 'text',
            modelKey: 'key',
            thKey: '排序项',
          },
        ],
      };
    }
  };
}
