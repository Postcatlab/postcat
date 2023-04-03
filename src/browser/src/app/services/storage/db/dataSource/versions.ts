import type { DataSourceInstance } from 'pc/browser/src/app/services/storage/db/dataSource';
import { migrationToV3, migrationToV4 } from 'pc/browser/src/app/services/storage/db/dataSource/migration';

export const setupVersions = (db: DataSourceInstance) => {
  /**
   * see: https://github.com/dexie/Dexie.js/issues/781
   * 由于 IndexedDB 不允许自行更改主键，因此我们需要执行以下操作
   * 1. 将旧表的数据复制到新的临时表中，并删除旧表
   * 2. 使用新的主键重新创建旧表，并将临时表的数据复制回来
   * 3. 删除临时表
   */
  // Add intermediate version and copy table to temp table, deleting origin version.
  db.version(3)
    .stores({
      //Delete table
      project: null,
      environment: null,
      group: null,
      apiData: null,
      apiTestHistory: null,
      mock: null,

      //Create temporary table
      projectTemp: '++id',
      environmentTemp: '++id',
      groupTemp: '++id',
      apiDataTemp: '++id',
      apiTestHistoryTemp: '++id',
      mockTemp: '++id'
    })
    .upgrade(migrationToV3);

  //  Copy table to new table, deleting temp table:
  db.version(4)
    .stores({
      // Delete temp table
      projectTemp: null,
      environmentTemp: null,
      groupTemp: null,
      apiDataTemp: null,
      apiTestHistoryTemp: null,
      mockTemp: null,

      workspace: '++id, &uuid, name',
      project: '++id, &uuid, name, workSpaceUuid',
      environment: '++id, name, projectUuid, workSpaceUuid',
      group: '++id, projectUuid, workSpaceUuid, parentId, name',
      apiData: '++id, &uuid, projectUuid, workSpaceUuid, name',
      apiTestHistory: '++id, projectUuid, apiUuid, workSpaceUuid',
      mock: '++id, name, projectUuid,apiUuid, workSpaceUuid'
    })
    .upgrade(migrationToV4);

  /**
   * 0.3.0
   * Add projectSetting
   */
  db.version(5).stores({
    projectSyncSetting: '++id, projectUuid'
  });

  /**
   * 0.5.0
   * Add apiCase
   */
  db.version(6).stores({
    workspace: '++id, &uuid',
    project: '++id, &uuid, workSpaceUuid',
    group: '++id,parentId,projectUuid',
    environment: '++id, projectUuid',
    apiData: '++id, &uuid, projectUuid ',
    mock: '++id, projectUuid,apiUuid',
    apiCase: '++id,projectUuid,apiUuid '
  });
  db.version(7).stores({
    group: '++id,parentId,projectUuid',
    environment: '++id, projectUuid,workSpaceUuid',
    apiData: '++id, &uuid, projectUuid,workSpaceUuid',
    mock: '++id,projectUuid,apiUuid,workSpaceUuid',
    apiCase: '++id,projectUuid,apiUuid,workSpaceUuid'
  });
};
