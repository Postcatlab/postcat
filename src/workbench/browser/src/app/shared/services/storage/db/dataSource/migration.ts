import type { Transaction } from 'dexie';
import { WorkspaceService } from 'eo/workbench/browser/src/app/shared/services/storage/db/services/workspace.service';

/** indexedDB 升级到 v3
 *
 * @description 这里主要是为了创建临时表存储旧表的数据，为下面 升级 v4 做铺垫
 */
export const migrationToV3 = async (trans: Transaction) => {
  const projects = await trans.table('project').toArray();
  await trans.table('projectTemp').bulkAdd(projects);

  const apiDatas = await trans.table('apiData').toArray();
  await trans.table('apiDataTemp').bulkAdd(apiDatas);

  const environments = await trans.table('environment').toArray();
  await trans.table('environmentTemp').bulkAdd(environments);

  const groups = await trans.table('group').toArray();
  await trans.table('groupTemp').bulkAdd(groups);

  const apiTestHistorys = await trans.table('apiTestHistory').toArray();
  await trans.table('apiTestHistoryTemp').bulkAdd(apiTestHistorys);

  const mocks = await trans.table('mock').toArray();
  await trans.table('mockTemp').bulkAdd(mocks);
};

/** indexedDB 升级到 v4  */
export const migrationToV4 = async (trans: Transaction) => {
  const workspaceService = new WorkspaceService();
  const { data: workspace } = await workspaceService.create({ title: 'Persional Workspace' });

  const projects = await trans.table('projectTemp').toArray();
  await trans.table('project').bulkAdd(projects);

  const apiDatas = await trans.table('apiDataTemp').toArray();
  await trans.table('apiData').bulkAdd(apiDatas);

  const environments = await trans.table('environmentTemp').toArray();
  await trans.table('environment').bulkAdd(environments);
  console.log('environments', environments);

  const groups = await trans.table('groupTemp').toArray();
  await trans.table('group').bulkAdd(groups);

  const apiTestHistorys = await trans.table('apiTestHistoryTemp').toArray();
  await trans.table('apiTestHistory').bulkAdd(apiTestHistorys);

  const mocks = await trans.table('mockTemp').toArray();
  await trans.table('mock').bulkAdd(mocks);

  const modify = (tableName: string, callback?) => {
    return trans
      .table(tableName)
      .toCollection()
      .modify(item => {
        item.createTime = item.createdAt;
        item.updateTime = item.updatedAt;
        item.id ??= item.uuid;
        item.workSpaceUuid = workspace.uuid;
        callback?.(item);
      });
  };

  await modify('project');

  await modify('apiData', item => {
    item.projectUuid = item.projectID;
  });

  await modify('environment', item => {
    item.projectUuid = item.projectID;
  });

  await modify('group', item => {
    item.projectUuid = item.projectID;
    item.sort = item.weight;
  });

  await modify('mock', item => {
    item.apiUuid = item.apiDataID;
    item.projectUuid = item.projectID;
  });

  await modify('apiTestHistory', item => {
    item.apiUuid = item.apiDataID;
    item.projectUuid = item.projectID;
    item.sort = item.weight;
    item.request = {
      ...item.request,
      script: {
        beforeScript: item.beforeScript,
        afterScript: item.afterScript
      },
      headerParams: []
    };
    item.response = {
      ...item.response,
      ...item.general
    };
  });
};
