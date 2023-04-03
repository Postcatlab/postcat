import Dexie, { Table } from 'dexie';
import { setupVersions } from 'pc/browser/src/app/services/storage/db/dataSource/versions';
import {
  Workspace,
  Project,
  Group,
  Environment,
  ApiTestHistory,
  Mock,
  ProjectSyncSetting,
  ApiCase
} from 'pc/browser/src/app/services/storage/db/models';
import { ApiData } from 'pc/browser/src/app/services/storage/db/models/apiData';
import { DbProjectService } from 'pc/browser/src/app/services/storage/db/services/project.service';
import { DbWorkspaceService } from 'pc/browser/src/app/services/storage/db/services/workspace.service';
/**
 * The name of the alignment backend to use.
 */
export const UUID_MAP = {
  workspace: {
    uuid: 'workSpaceUuid'
  },
  project: {
    uuid: 'projectUuid'
  },
  apiData: {
    uuid: 'apiUuid'
  },
  apiCase: {
    id: 'apiCaseUuid'
  }
};
/**
 * Convert the ID passed in from the front end to the database ID
 *For example, apiUuid is converted to uuid
 */
export const convertViewIDtoIndexedDBID = (db, params: any = {}) => {
  if (!params) return params;
  if (!db) {
    throw new Error(`db is not defined`);
  }
  const tableMap = UUID_MAP[db.name];
  if (tableMap) {
    const dbID = Object.keys(tableMap)[0];
    const modelID = tableMap[dbID];
    if (params[modelID] || params[`${modelID}s`]) {
      params[dbID] = params[modelID] || params[`${modelID}s`];
    }
  }

  return params;
};
class DataSource extends Dexie {
  workspace!: Table<Workspace, number>;
  project!: Table<Project, number>;
  projectSyncSetting!: Table<ProjectSyncSetting, number>;
  group!: Table<Group, number>;
  environment!: Table<Environment, number>;
  apiData!: Table<ApiData, number>;
  apiCase!: Table<ApiCase, number>;
  apiTestHistory!: Table<ApiTestHistory, number>;
  mock!: Table<Mock, number>;
  constructor() {
    super('postcat_core');
    setupVersions(this);
    this.open();
    this.initHooks();
    this.on('populate', () => this.populate());
  }

  private async populate() {
    const workspaceService = new DbWorkspaceService();
    const projectService = new DbProjectService();

    const {
      data: { uuid: workSpaceUuid }
    } = await workspaceService.create({ title: $localize`Personal Workspace` });

    await projectService.bulkCreate({ projectMsgs: [{ name: 'Default' }], workSpaceUuid }, true);
  }

  initHooks() {
    this.tables.forEach(table => {
      table.hook('creating', (primKey, obj) => {
        // Filter out the ID passed in by the client
        const tableMap = UUID_MAP[table.name];
        if (tableMap) {
          const dbID = Object.keys(tableMap)[0];
          Reflect.deleteProperty(obj, dbID);
          const modelID = tableMap[dbID];
          Reflect.deleteProperty(obj, modelID);
        }
        Reflect.deleteProperty(obj, 'id');

        const isDefUuid = table.schema.idxByName.uuid?.keyPath;
        if (isDefUuid) {
          // dexie 貌似没有直接提供自动生成 uuid 功能，所以这里简单实现一下
          // 官方默认的语法支持：https://dexie.org/docs/Version/Version.stores()#schema-syntax
          obj['uuid'] ??= crypto.randomUUID();
        }
        obj.updateTime = obj.createTime = Date.now();
      });
      // https://dexie.org/docs/Table/Table.hook('reading')
      table.hook('reading', obj => {
        // 表字段映射
        const tableMap = UUID_MAP[table.name];
        if (tableMap) {
          const dbID = Object.keys(tableMap)[0];
          if (obj[dbID]) {
            const modelID = tableMap[dbID];
            obj[modelID] = obj[dbID];
          }
        }

        if (table.name === 'workspace') {
          // 主要用于区分本地空间和远程空间
          obj.isLocal = true;
        }
        return obj;
      });
      table.hook('updating', (modifications, primKey, obj) => {
        return { ...modifications, updateTime: Date.now() };
      });
    });
  }
}

export const dataSource = new DataSource();

export type DataSourceInstance = typeof dataSource;
