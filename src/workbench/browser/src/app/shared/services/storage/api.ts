const http = {
  api: [
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
      name: 'workspace',
      data: [
        { 'create @post': '/workspace', json: 'title' },
        { 'list @get': '/workspace/list', query: '...' },
        { 'edit @put': '/workspace/{workspaceID}', json: 'title' },
        { 'delete @delete': '/workspace/{workspaceID}' },
        { 'member @get': '/workspace/{workspaceID}/member/list' },
        { 'searchMember @get': '/workspace/{workspaceID}/member/list/{username}' },
        { 'addMember @post': '/workspace/{workspaceID}/member/add', json: 'userIDs' },
        { 'removeMember @delete': '/workspace/{workspaceID}/member/remove', body: 'userIDs' },
        { 'memberQuit @post': '/workspace/{workspaceID}/member/leave' },
        { 'setRole @post': '/workspace/{workspaceID}/member/setRole', json: 'roleID, memberID' },
        { 'permission @get': '/workspace/{workspaceID}/rolePermission' }
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
      name: 'environment',
      data: [
        { 'create @post@create': '/environment' },
        { 'update @put': '/environment/{uuid}', json: '...' },
        { 'delete @delete': '/environment/{uuid}' }
      ]
    },
    {
      name: 'group',
      data: [{ 'create @post': '/group' }, { 'update @put': '/group/{uuid}', json: '...' }, { 'delete @delete': '/group?uuids=[{uuid}]' }]
    },
    {
      name: 'api',
      data: [
        { 'create @post': '/api_data' },
        { 'update @put': '/api_data/{uuid}', json: '...' },
        { 'delete @delete': '/api_data?uuids=[{uuid}]' },
        { 'loadApi @get': '/api_data/{uuid}' }
      ]
    },
    {
      name: 'test',
      data: [{ 'create @post': '/api_test_history' }, { 'delete @delete': '/api_test_history?uuids=[{uuid}]' }]
    },
    {
      name: 'mock',
      data: [
        { 'create @post': '/mock' },
        { 'load @get': '/mock/{uuid}' },
        { 'delete @delete': '/mock/{uuid}' },
        { 'update @put': '/mock/{uuid}', json: '...' }
      ]
    }
  ]
};

export default http;
