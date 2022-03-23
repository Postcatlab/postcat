  /*
     * author：Eoapi
     * 分组相关服务js
     */
  angular.module('eolinker')
    .factory('GroupService', GroupService);

  GroupService.$inject = ['$rootScope'];

  function GroupService($rootScope) {
    const data = {
      group: null,
      get: null,
      set: null,
      clear: null,
      isShrink: null,
    };
    data.get = function () {
      return data.group;
    };
    data.set = function (request, boolean) {
      data.group = request;
      if (boolean) {
        $rootScope.$broadcast('$SidebarFinish');
      }
    };
    data.clear = function () {
      data.group = null;
    };
    return data;
  }
