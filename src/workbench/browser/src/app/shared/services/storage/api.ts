const http = {
  api: [
    {
      name: 'apiData',
      data: [
        { 'create @post @create': '/api', json: 'apiList, projectUuid, workSpaceUuid' },
        { 'update @put @update': '/api', json: 'api, projectUuid, workSpaceUuid' },
        { 'delete @delete @delete': '/api/remove', json: 'apiUuid, projectUuid, workSpaceUuid' },
        { 'detail @get @read': '/api', query: 'projectUuid, workSpaceUuid' },
        { 'list @get @bulkRead': '/api/list', json: 'api, projectUuid, workSpaceUuid' }
      ]
    },
    {
      name: 'mock',
      data: [
        { 'create @post @create': '/mock', json: 'name, apiUuid, createWay, response, projectUuid, workSpaceUuid, ...' },
        { 'update @put @update': '/mock', json: 'id, projectUuid, workSpaceUuid, ...' },
        { 'list @get @bulkRead': '/mock/list', json: 'apiUuid, projectUuid, workSpaceUuid, page, pageSize' },
        { 'detail @get @read': '/mock', json: 'id, projectUuid, workSpaceUuid' },
        { 'delete @delete @delete': '/mock', json: 'id, projectUuid, workSpaceUuid' }
      ]
    },
    {
      name: 'group',
      data: [
        { 'create @post @create': '/group', json: 'module, type, name, projectUuid, workSpaceUuid, ...' },
        { 'update @put @update': '/group', json: 'id, projectUuid, workSpaceUuid, ...' },
        { 'delete @delete @delete': '/group', json: 'id, projectUuid, workSpaceUuid' },
        { 'detail @get @read': '/group', json: 'id, projectUuid, workSpaceUuid' },
        { 'list @get @bulkRead': '/group/list', query: 'projectUuid, workSpaceUuid' }
      ]
    },
    {
      name: 'apiTestHistory',
      data: [
        { 'create @post @create': '/api/history', json: 'apiUuid, general, request, response, projectUuid, workSpaceUuid' },
        { 'list @get @bulkRead': '/api/history/list', json: 'apiUuid, projectUuid, workSpaceUuid, page, pageSize' },
        { 'detail @get @read': '/api/history', json: 'id, projectUuid, workSpaceUuid' },
        { 'delete @delete @bulkDelete': '/api/history', json: 'projectUuid, workSpaceUuid' }
      ]
    },
    {
      name: 'environment',
      data: [
        { 'create @post @create': '/environment', json: 'name, projectUuid, workSpaceUuid, ...' },
        { 'update @put @update': '/environment', json: 'id, name, projectUuid, workSpaceUuid, ...' },
        { 'delete @delete @delete': '/environment', json: 'id, projectUuid, workSpaceUuid' },
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
        { 'delete @delete @delete': '/workspaces', json: 'workSpaceUuids' },
        { 'searchMember @get': '/workspaces/users', query: 'username, page, pageSize, workSpaceUuid' },
        { 'addMember @post': '/workspaces/users', json: 'userIds, workSpaceUuid' },
        { 'removeMember @delete': '/workspaces/users', json: 'userIds, workSpaceUuid' },
        { 'memberQuit @delete': '/workspaces/users/quit', json: 'workSpaceUuid' },
        { 'addMemberRole @post': '/workspaces/users/roles', json: 'userRole, workSpaceUuid' },
        { 'searchMember @get': '/workspaces/users/roles', json: 'workSpaceUuid' },
        { 'list @get @bulkRead': '/workspaces' }
      ]
    },
    {
      name: 'project',
      data: [
        { 'create @post': '/project' },
        { 'update @put': '/project/{uuid}', json: '...' },
        { 'delete @delete': '/project/{uuid}' },
        { 'export @get': '/project/export' },
        { 'addMember @post': '/project/{projectID}/member/add', json: 'userIDs' },
        { 'delMember @delete': '/project/{projectID}/member/remove', body: 'userIDs' },
        { 'member @get': '/project/{projectID}/member/list' },
        { 'memberQuit @post': '/project/{projectID}/member/leave' },
        { 'setRole @post': '/project/{projectID}/member/setRole', json: 'roleID, memberID' },
        { 'roleList @get': '/project/{projectID}/roles' },
        { 'permission @get': '/project/{projectID}/rolePermission' }
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
