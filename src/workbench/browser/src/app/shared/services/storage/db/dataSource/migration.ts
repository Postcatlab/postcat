import { Transaction } from 'dexie';
import { WorkspaceService } from 'eo/workbench/browser/src/app/shared/services/storage/db/services/workspace.service';

/** 升级到 v3 */
export const migrationToV3 = async (trans: Transaction) => {
  const workspaceService = new WorkspaceService();
  const { data: workspace } = await workspaceService.create({ title: 'Persional Workspace' });

  const modify = (tableName: string, callback?) => {
    return trans
      .table(tableName)
      .toCollection()
      .modify(item => {
        item.createTime = item.createdAt;
        item.updateTime = item.updatedAt;
        item.id = item.uuid;
        item.workSpaceUuid = workspace.uuid;
        callback?.(item);
      });
  };

  await modify('project');

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
