import Dexie, { Table } from 'dexie';
import { db } from 'eo/workbench/browser/src/app/shared/services/storage/db';
import { genSimpleApiData } from 'eo/workbench/browser/src/app/shared/services/storage/db/initData/apiData';
import {
  Workspace,
  Project,
  Group,
  ApiData,
  Environment,
  ApiTestHistory,
  Mock
} from 'eo/workbench/browser/src/app/shared/services/storage/db/models';

class DataSource extends Dexie {
  workspace!: Table<Workspace, number | string>;
  project!: Table<Project, number | string>;
  group!: Table<Group, number | string>;
  environment!: Table<Environment, number | string>;
  apiData!: Table<ApiData, number | string>;
  apiTestHistory!: Table<ApiTestHistory, number | string>;
  mock!: Table<Mock, number | string>;

  constructor() {
    super('postcat_core_test');
    this.version(1).stores({
      workspace: '++id, &uuid, name, isLocal',
      project: '++id, &uuid, name',
      environment: '++id, name, projectUuid, workSpaceUuid',
      group: '++id, projectUuid, workSpaceUuid, parentId, name',
      apiData: '++id, &uuid, projectUuid, workSpaceUuid, name',
      apiTestHistory: '++id, projectUuid, apiUuid, workSpaceUuid',
      mock: '++id, name, projectUuid, workSpaceUuid'
    });
    this.open();
    this.initHooks();
    this.on('populate', () => this.populate());
  }

  private async populate() {
    const workspaceID = await this.workspace.add({ title: 'Persional Workspace', isLocal: true });
    const workspace = await this.workspace.get(workspaceID);

    const projectID = await this.project.add({ name: 'Default' });
    const project = await this.project.get(projectID);

    const params = { workSpaceUuid: workspace.uuid, projectUuid: project.uuid };

    const sampleApiData = genSimpleApiData(params);
    // @ts-ignore
    await db.apiData.bulkCreate(sampleApiData);
  }

  initHooks() {
    // 表字段映射
    const uuidMap = {
      workspace: 'workSpaceUuid',
      project: 'projectUuid',
      apiData: 'apiUuid'
    };
    this.tables.forEach(table => {
      const isDefUuid = table.schema.idxByName.uuid?.keyPath;
      table.hook('creating', (primKey, obj) => {
        if (isDefUuid) {
          // dexie 貌似没有直接提供自动生成 uuid 功能，所以这里简单实现一下
          // 官方默认的语法支持：https://dexie.org/docs/Version/Version.stores()#schema-syntax
          obj['uuid'] = crypto.randomUUID();
        }
        obj.updateTime = obj.createTime = Date.now();
      });
      // https://dexie.org/docs/Table/Table.hook('reading')
      table.hook('reading', obj => {
        const uuidName = uuidMap[table.name];
        if (uuidName) {
          obj[uuidName] = obj.uuid;
        }
        return obj;
      });
      table.hook('updating', (modifications, primKey, obj) => {
        obj.updateTime = Date.now();
        return obj;
      });
    });
  }
}

export const dataSource = new DataSource();
