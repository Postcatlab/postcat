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
      project: null, // Delete table
      environment: null, // Delete table
      group: null, // Delete table
      apiData: null, // Delete table
      apiTestHistory: null, // Delete table
      mock: null, // Delete table

      projectTemp: '++id', // Create temp table
      environmentTemp: '++id', // Create temp table
      groupTemp: '++id', // Create temp table
      apiDataTemp: '++id', // Create temp table
      apiTestHistoryTemp: '++id', // Create temp table
      mockTemp: '++id' // Create temp table
    })
    .upgrade(migrationToV3);

  //  Copy table to new table, deleting temp table:
  db.version(4)
    .stores({
      projectTemp: null, // Delete temp table
      environmentTemp: null, // Delete temp table
      groupTemp: null, // Delete temp table
      apiDataTemp: null, // Delete temp table
      apiTestHistoryTemp: null, // Delete temp table
      mockTemp: null, // Delete temp table

      workspace: '++id, &uuid, name',
      project: '++id, &uuid, name, workSpaceUuid',
      environment: '++id, name, projectUuid, workSpaceUuid',
      group: '++id, projectUuid, workSpaceUuid, parentId, name',
      apiData: '++id, &uuid, projectUuid, workSpaceUuid, name',
      apiTestHistory: '++id, projectUuid, apiUuid, workSpaceUuid',
      mock: '++id, name, projectUuid, workSpaceUuid'
    })
    .upgrade(migrationToV4);

  /**
   * 0.3.0
   * 新增项目同步配置
   */
  db.version(5).stores({
    projectSyncSetting: '++id, &uuid, pluginId, pluginSettingJson, projectUuid, workSpaceUuid'
  });
};
