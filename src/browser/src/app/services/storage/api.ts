const http = {
  api: [
    {
      name: 'apiData',
      data: [
        { 'create @post @bulkCreate': '/api/api', json: 'apiList, projectUuid, workSpaceUuid' },
        { 'update @put @update': '/api/api', json: 'api, projectUuid, workSpaceUuid' },
        { 'delete @post @bulkDelete': '/api/api/remove', json: 'apiUuids, projectUuid, workSpaceUuid' },
        { 'detail @get @bulkReadDetail': '/api/api', query: 'apiUuids, projectUuid, workSpaceUuid, ...' },
        { 'list @get @page': '/api/api/list', query: 'projectUuid, workSpaceUuid, ...' },
        { 'getGroup @post': '/api/projects/collections', json: 'projectUuid' }
      ]
    },
    {
      name: 'mock',
      data: [
        { 'create @post @create': '/api/mock', json: 'name, apiUuid, createWay, response, projectUuid, workSpaceUuid, ...' },
        { 'update @put @update': '/api/mock', json: 'id, projectUuid, workSpaceUuid, ...' },
        { 'list @get @page': '/api/mock/list', query: 'apiUuid, projectUuid, workSpaceUuid, page, pageSize' },
        { 'detail @get @read': '/api/mock', query: 'id, projectUuid, workSpaceUuid' },
        { 'delete @delete @delete': '/api/mock', query: 'id, projectUuid, workSpaceUuid' }
      ]
    },
    {
      name: 'group',
      data: [
        { 'create @post @bulkCreate': '/api/group', only: '' },
        { 'update @put @update': '/api/group', json: 'id, projectUuid, workSpaceUuid, ...' },
        { 'delete @delete @delete': '/api/group', query: 'id, projectUuid, workSpaceUuid' },
        { 'detail @get @read': '/api/group', query: 'id, projectUuid, workSpaceUuid' },
        { 'list @get @bulkRead': '/api/group/list', query: 'projectUuid, workSpaceUuid, withItem' }
      ]
    },
    {
      name: 'apiTestHistory',
      data: [
        { 'create @post @create': '/api/api/history', json: 'apiUuid, general, request, response, projectUuid, workSpaceUuid' },
        { 'list @get @page': '/api/api/history/list', query: 'projectUuid, workSpaceUuid, page, pageSize' },
        { 'detail @get @read': '/api/api/history', query: 'id, projectUuid, workSpaceUuid' },
        { 'delete @post @bulkDelete': '/api/api/history/batch-delete', json: 'ids, projectUuid, workSpaceUuid' }
      ]
    },
    {
      name: 'environment',
      data: [
        { 'create @post @create': '/api/environment', json: 'name, projectUuid, workSpaceUuid, ...' },
        { 'update @put @update': '/api/environment', json: 'id, name, projectUuid, workSpaceUuid, ...' },
        { 'delete @delete @delete': '/api/environment', query: 'id, projectUuid, workSpaceUuid' },
        { 'detail @get @read': '/api/environment', query: 'id, projectUuid, workSpaceUuid' },
        { 'list @get @bulkRead': '/api/environment/list', query: 'projectUuid, workSpaceUuid' }
      ]
    },
    {
      // * user 模块已经完成替换
      name: 'user',
      data: [
        { 'readInfo @post': '/usercenter/common/user/info' }, // 查看个人信息
        { 'updateInfo @post': '/usercenter/common/user/update-userinfo' }, // 更新个人资料
        { 'updatePassword @put': '/api/user/password', json: 'password' }, // 更改个人密码
        { 'login @post': '/api/user/login', json: 'username, password' },
        { 'refreshToken @post': '/usercenter/common/sso/refresh' }, // 刷新token
        { 'logout @post': '/usercenter/common/sso/logout' }, // 退出登录
        { 'search @get': '/api/user', query: 'username' }, // 搜索用户
        { 'thirdLogin @post': '/usercenter/common/third-party/uri', json: 'type, client, redirectUri, appType, ...' },
        { 'thirdLoginResult @post': '/usercenter/common/third-party/login-check', json: 'code' },
        { 'getToken @get': '/api/user/access-token' }, // 获取 Token
        { 'resetToken @post': '/api/user/access-token/reset' } // 重置 Token
      ]
    },
    {
      name: 'workspace',
      data: [
        { 'create @post @create': '/api/workspaces', json: 'titles' }, // 批量创建空间
        { 'update @put @update': '/api/workspaces', json: 'title, workSpaceUuid' },
        { 'delete @delete @delete': '/api/workspaces', query: 'workSpaceUuids' },
        { 'searchMember @get': '/api/workspaces/users', query: 'username, page, pageSize, workSpaceUuid' },
        { 'addMember @post': '/api/workspaces/users', json: 'userIds, workSpaceUuid' },
        { 'removeMember @delete': '/api/workspaces/users', query: 'userIds, workSpaceUuid' },
        { 'memberQuit @delete': '/api/workspaces/users/quit', query: 'workSpaceUuid' },
        { 'addMemberRole @post': '/api/workspaces/users/roles', json: 'userRole, workSpaceUuid' },
        { 'getMemberPermiss @get': '/api/workspaces/users/roles', query: 'workSpaceUuid' },
        { 'list @get': '/api/workspaces' },
        { 'roles @get': '/api/workspaces/users/roles', query: 'workSpaceUuid' },
        { 'setRole @post': '/api/workspaces/users/roles', json: 'userRole, workSpaceUuid' }
      ]
    },
    {
      name: 'project',
      data: [
        { 'exportProject @get @exports': '/api/projects/exports', query: 'projectUuid, workSpaceUuid' },
        { 'memberList @get': '/api/projects/users', query: 'username, projectUuid' },
        { 'addMember @post': '/api/projects/users', json: 'userIds, projectUuid' },
        { 'delMember @delete': '/api/projects/users', query: 'userIds, projectUuid' },
        { 'memberQuit @delete': '/api/projects/users/quit', query: 'userId, projectUuid' },
        { 'setRole @post': '/api/projects/users/roles', json: 'projectUuid, userRole' },
        { 'getRole @get': '/api/projects/users/roles/own', query: 'projectUuid' },
        { 'userPermission @get': '/api/projects/users/roles', query: 'projectUuid' },
        { 'create @post @bulkCreate': '/api/projects', json: 'projectMsgs, workSpaceUuid' },
        { 'list @get @page': '/api/projects', query: 'projectUuids, workSpaceUuid' },
        { 'update @put @update': '/api/projects', json: 'projectUuid, name, description' },
        { 'delete @delete @bulkDelete': '/api/projects', query: 'projectUuids' },
        { 'import @post @import': '/api/projects/import' },
        { 'createSyncSetting @post @createSyncSetting': '/api/project/sync-setting', json: 'projectUuid, workSpaceUuid, ...' },
        { 'updateSyncSetting @put @updateSyncSetting': '/api/project/sync-setting', json: 'projectUuid, workSpaceUuid, ...' },
        { 'delSyncSetting @delete @delSyncSetting': '/api/project/sync-setting', query: 'id, projectUuid, workSpaceUuid' },
        { 'getSyncSettingList @get @getSyncSettingList': '/api/project/sync-setting/list', query: 'projectUuid, workSpaceUuid' },
        { 'syncBatchUpdate @post @syncBatchUpdate': '/api/api/batch-update', json: 'projectUuid, workSpaceUuid, ...' }
      ]
    },
    {
      name: 'role',
      data: [{ 'list @get': '/api/roles' }]
    },
    {
      name: 'projectShare',
      data: [
        { 'createShare @post': '/api/project-shared', json: 'projectUuid, workSpaceUuid' },
        { 'getShareLink @get': '/api//project-shared', query: 'projectUuid, workSpaceUuid' },
        { 'deleteShare @delete': '/api/project-shared', query: 'sharedUuid' }
      ]
    },
    {
      name: 'share',
      data: [
        { 'projectDetail @get': '/api/project-shared/project', query: 'sharedUuid' },
        { 'groupList @get': '/api/project-shared/group/list', query: 'sharedUuid, withItem' },
        { 'apiDataDetail @get': '/api/project-shared/api/list', query: 'apiUuids, sharedUuid, ...' },
        { 'environmentList @get': '/api/project-shared/env/list', query: 'sharedUuid' }
      ]
    }
  ]
};

export default http;
