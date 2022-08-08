const http = {
  api: [
    {
      name: 'project',
      data: [
        { 'create @post': '/project' },
        { 'update @put': '/project/{uuid}', json: '...' },
        { 'delete @delete': '/project/{uuid}' },
        { 'export @get': '/project/export' },
      ],
    },
    {
      name: 'env',
      data: [
        { 'create @post': '/environment' },
        { 'update @put': '/environment/{uuid}' },
        { 'delete @delete': '/environment/{uuid}' },
        { 'load @get': '/environment/{uuid}' },
        { 'loadByProjectID @get': '/environment', query: 'projectID' },
      ],
    },
    {
      name: 'group',
      data: [
        { 'create @post': '/group' },
        { 'update @put': '/group/{uuid}', json: '...' },
        { 'bulkUpdate @put': '/group/batch' },
        { 'delete @delete': '/group?uuids=[{uuid}]' },
        { 'loadAll @get': '/group', query: 'projectID' },
      ],
    },
    {
      name: 'api',
      data: [
        { 'create @post': '/api_data' },
        { 'update @put': '/api_data/{uuid}', json: '...' },
        { 'bulkUpdate @put': '/api_data/batch' },
        { 'delete @delete': '/api_data?uuids=[{uuids}]' },
        { 'loadApi @get': '/api_data/{uuid}' },
        { 'LoadAllByProjectID @get': '/api_data', query: 'projectID' },
      ],
    },
    {
      name: 'test',
      data: [
        { 'create @post': '/api_test_history' },
        { 'delete @delete': '/api_test_history?uuids=[{uuids}]' },
        { 'LoadAll @get': '/api_test_history', query: 'apiDataID' },
      ],
    },
    {
      name: 'mock',
      data: [
        { 'create @post': '/mock' },
        { 'load @get': '/mock/{uuid}' },
        { 'delete @delete': '/mock/{uuid}' },
        { 'update @put': '/mock/{uuid}', json: '...' },
        { 'loadAll @get': '/mock', query: 'apiDataID' },
      ],
    },
  ],
};

export default http;