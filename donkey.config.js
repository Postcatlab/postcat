const baseUrl = './src/browser/src/app/shared/services/storage/';
module.exports = {
  entry: {
    // target: ["./test/apiData.ts", "./test/env.ts"]
    target: [baseUrl + 'api.ts']
  },
  output: [
    {
      mode: 'angular',
      name: 'remote.service',
      path: baseUrl
    },
    {
      mode: 'dexie',
      name: 'local.service',
      path: baseUrl
    },
    {
      mode: 'glue',
      name: 'api.service',
      path: baseUrl
    }
    // schema: "./output/entities"
    // typeorm: "./output/typeorm"
  ],
  remoteBase: '',
  paramsFill: {
    projectUuid: 'this.store.getCurrentProjectID',
    workSpaceUuid: 'this.store.getCurrentWorkspaceUuid',
    withItem: true
  }
};
