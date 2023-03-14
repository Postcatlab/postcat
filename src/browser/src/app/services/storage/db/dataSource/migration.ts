import type { PromiseExtended, Transaction } from 'dexie';
import { WorkspaceService } from 'pc/browser/src/app/services/storage/db/services/workspace.service';

import { convertApiData } from './convert';

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
  const { data: workspace } = await workspaceService.create({ title: $localize`Personal Workspace` });

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
      .modify(async (item, ctx) => {
        item.createTime = item.createdAt;
        item.updateTime = item.updatedAt;
        item.workSpaceUuid = workspace.uuid;
        if (item.uuid) {
          item.id ??= item.uuid;
          item.uuid = item.uuid ? String(item.uuid) : item.uuid;
        }
        await callback?.(item, ctx);
      });
  };

  // 因为 modify 的回调是同步操作，所以需要将回调里面的异步操作保存的数组里面
  const rootGroupPromiseArr: Array<PromiseExtended<any>> = [];
  await modify('project', async item => {
    rootGroupPromiseArr.push(
      trans.table('group').add({
        type: 0,
        name: 'Root directory',
        depth: 0,
        projectUuid: String(item.uuid),
        workSpaceUuid: workspace.uuid
      })
    );
  });

  const result = await Promise.all(rootGroupPromiseArr);
  // console.log('result', result);

  await modify('apiData', async (item, ref) => {
    item.groupId = item.groupID;
    item.orderNum = item.weight;
    item.projectUuid ??= String(item.projectID);
    ref.value = {
      ...item,
      ...convertApiData(item)
    };
    if (item.groupID === 0) {
      const rootGroup = await trans.table('group').where({ projectUuid: item.projectUuid, depth: 0 }).first();
      // console.log('apiData rootGroup', rootGroup);
      if (rootGroup) {
        trans.table('apiData').update(item.id, { groupId: rootGroup.id });
      }
    }
  });

  await modify('group', async item => {
    item.parentId = item.parentID;
    item.projectUuid ??= String(item.projectID);
    item.sort = item.weight;
    // 给父分组为虚拟根目录的 group
    if (item.parentID === 0) {
      const rootGroup = await trans.table('group').where({ projectUuid: item.projectUuid, depth: 0 }).first();
      // console.log('group rootGroup', rootGroup);
      if (rootGroup) {
        trans.table('group').update(item.id, { parentId: rootGroup.id });
      }
    }
  });

  await modify('environment', item => {
    item.projectUuid ??= String(item.projectID);
  });

  await modify('mock', item => {
    item.apiUuid = String(item.apiDataID);
    item.projectUuid ??= String(item.projectID);
  });

  await modify('apiTestHistory', (item, ref) => {
    item.apiUuid = String(item.apiDataID);
    item.projectUuid ??= String(item.projectID);
    item.sort = item.weight;
    item.request = {
      ...convertApiData(item.request),
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
