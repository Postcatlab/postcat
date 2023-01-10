import Dexie, { Table } from 'dexie';
import { db } from 'eo/workbench/browser/src/app/shared/services/storage/db';
import { genSimpleApiData } from 'eo/workbench/browser/src/app/shared/services/storage/db/initData/apiData';
import { Workspace, Project, Group, ApiData } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { Mock, ApiTestHistory, Environment } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';

export class DataSource extends Dexie {
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
      workspace: '++id, &uuid, name',
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
    const workspaceID = await this.workspace.add({ title: 'Persional Workspace' });
    const workspace = await this.workspace.get(workspaceID);

    const projectID = await this.project.add({ name: 'Default' });
    const project = await this.project.get(projectID);

    const params = { workSpaceUuid: workspace.uuid, projectUuid: project.uuid };

    const sampleApiData = genSimpleApiData(params);
    await db.apiData.bulkCreate(sampleApiData);
  }

  initHooks() {
    this.tables.forEach(table => {
      const isDefUuid = table.schema.idxByName.uuid?.keyPath;
      table.hook('creating', (primKey, obj) => {
        // 如果表 schema 定义了 uuid 则自动生成
        if (isDefUuid) {
          obj['uuid'] = crypto.randomUUID();
        }
      });
    });
  }
}

export const dataSource = new DataSource();
