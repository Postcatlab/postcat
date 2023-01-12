const http = {
  api: [
    {
      name: 'apiData',
      data: [
        { 'create @post @create': '/api', json: 'apiList, projectUuid, workSpaceUuid' },
        { 'update @put @update': '/api', json: 'api, projectUuid, workSpaceUuid' },
        { 'delete @delete @delete': '/api/remove', body: 'apiUuid, projectUuid, workSpaceUuid' },
        { 'detail @get @read': '/api', query: 'apiUuids, projectUuid, workSpaceUuid' },
        { 'list @get @bulkRead': '/api/list', query: 'projectUuid, workSpaceUuid' }
      ]
    },
    {
      name: 'mock',
      data: [
        { 'create @post @create': '/mock', json: 'name, apiUuid, createWay, response, projectUuid, workSpaceUuid, ...' },
        { 'update @put @update': '/mock', json: 'id, projectUuid, workSpaceUuid, ...' },
        { 'list @get @bulkRead': '/mock/list', query: 'apiUuid, projectUuid, workSpaceUuid, page, pageSize' },
        { 'detail @get @read': '/mock', query: 'id, projectUuid, workSpaceUuid' },
        { 'delete @delete @delete': '/mock', body: 'id, projectUuid, workSpaceUuid' }
      ]
    },
    {
      name: 'group',
      data: [
        { 'create @post @create': '/group', json: 'module, type, name, projectUuid, workSpaceUuid, ...' },
        { 'update @put @update': '/group', json: 'id, projectUuid, workSpaceUuid, ...' },
        { 'delete @delete @delete': '/group', body: 'id, projectUuid, workSpaceUuid' },
        { 'detail @get @read': '/group', query: 'id, projectUuid, workSpaceUuid' },
        { 'list @get @bulkRead': '/group/list', query: 'projectUuid, workSpaceUuid' }
      ]
    },
    {
      name: 'apiTestHistory',
      data: [
        { 'create @post @create': '/api/history', json: 'apiUuid, general, request, response, projectUuid, workSpaceUuid' },
        { 'list @get @bulkRead': '/api/history/list', query: 'apiUuid, projectUuid, workSpaceUuid, page, pageSize' },
        { 'detail @get @read': '/api/history', query: 'id, projectUuid, workSpaceUuid' },
        { 'delete @delete @bulkDelete': '/api/history', body: 'projectUuid, workSpaceUuid' }
      ]
    },
    {
      name: 'environment',
      data: [
        { 'create @post @create': '/environment', json: 'name, projectUuid, workSpaceUuid, ...' },
        { 'update @put @update': '/environment', json: 'id, name, projectUuid, workSpaceUuid, ...' },
        { 'delete @delete @delete': '/environment', body: 'id, projectUuid, workSpaceUuid' },
        { 'detail @get @read': '/environment', query: 'id, projectUuid, workSpaceUuid' },
        { 'list @get @bulkRead': '/environment/list', query: 'projectUuid, workSpaceUuid' }
      ]
    },
    {
      // * user 模块已经完成替换
      name: 'user',
      data: [
        { 'readInfo @post': '/common/user/info' }, // 查看个人信息
        { 'updateInfo @post': '/common/user/update-userinfo' }, // 更新个人资料
        { 'updatePassword @post': '/common/user/change-password', body: 'password, ...' }, // 更改个人密码
        { 'login @post': '/user/login', body: 'username, password' },
        { 'refreshToken @post': '/common/sso/refresh' }, // 刷新token
        { 'logout @post': '/common/sso/logout' }, // 退出登录
        { 'search @post': '/user', query: 'username' } // 搜索用户
      ]
    },
    {
      name: 'workspace',
      data: [
        { 'create @post @create': '/workspaces', json: 'titles' }, // 批量创建空间
        { 'update @put @update': '/workspaces', json: 'title, workSpaceUuid' },
        { 'delete @delete @delete': '/workspaces', body: 'workSpaceUuids' },
        { 'searchMember @get': '/workspaces/users', query: 'username, page, pageSize, workSpaceUuid' },
        { 'addMember @post': '/workspaces/users', json: 'userIds, workSpaceUuid' },
        { 'removeMember @delete': '/workspaces/users', body: 'userIds, workSpaceUuid' },
        { 'memberQuit @delete': '/workspaces/users/quit', body: 'workSpaceUuid' },
        { 'addMemberRole @post': '/workspaces/users/roles', json: 'userRole, workSpaceUuid' },
        { 'getMemberPermiss @get': '/workspaces/users/roles', query: 'workSpaceUuid' },
        { 'list @get @bulkRead': '/workspaces' },
        { 'unkown @get': '/workspaces' }
      ]
    },
    {
      name: 'project',
      data: [
        { 'exportProject @get': '/project/exports', query: 'projectUuid' },
        { 'exportGroup @post': '/projects/collections', json: 'projectUuid' },
        { 'memberList @get': '/projects/users', query: 'username, projectUuid' },
        { 'addMember @post': '/projects/users', json: 'userIds, projectUuid' },
        { 'delMember @delete': '/projects/users', body: 'userIds, projectUuid' },
        { 'memberQuit @delete': '/projects/users/quit', body: 'userId, projectUuid' },
        { 'setRole @post': '/projects/users/roles', json: 'projectUuid, userRole' },
        { 'userPermission @get': '/projects/users/roles', query: 'projectUuid' },
        { 'create @post @bulkCreate': '/projects', json: 'projectMsgs, workSpaceUuid' },
        { 'detail @get @page': '/projects', query: 'projectUuids, workSpaceUuid' },
        { 'update @put @update': '/projects', json: 'projectUuid, name, description' },
        { 'delete @delete @delete': '/projects', body: 'projectUuids' }
      ]
    },
    {
      name: 'share',
      data: [{ 'createShare @post': '/shared' }, { 'getShareList @get': '/shared' }, { 'deleteShare @delete': '/shared' }]
    },
    {
      name: 'shareDoc',
      data: [
        { 'getAllAPI @get': '/shared-docs/{uniqueID}/collections' },
        { 'getApiDetail @get': '/shared-docs/{uniqueID}/api/{apiDataUUID}' },
        { 'getEnv @get': '/shared-docs/{uniqueID}/environments' }
      ]
    }
  ]
};

export default http;
