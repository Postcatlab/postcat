import Dexie, { Table } from 'dexie';
import { sampleApiData } from 'eo/workbench/browser/src/app/shared/services/storage/IndexedDB/lib/index.constant';
import {
  ApiData,
  Mock,
  ApiTestHistory,
  Environment,
  Group,
  Project
} from 'eo/workbench/browser/src/app/shared/services/storage/index.model';

export class DataSource extends Dexie {
  project!: Table<Project, number | string>;
  group!: Table<Group, number | string>;
  environment!: Table<Environment, number | string>;
  apiData!: Table<ApiData, number | string>;
  apiTestHistory!: Table<ApiTestHistory, number | string>;
  mock!: Table<Mock, number | string>;

  constructor() {
    super('postcat_core');
    this.version(2).stores({
      project: '++id, &projectUuid, name',
      environment: '++id, name, projectUuid, workSpaceUuid',
      group: '++id, projectUuid, workSpaceUuid, parentId, name',
      apiData: '++id, &apiUuid, projectUuid, workSpaceUuid, name',
      apiTestHistory: '++uuid, projectID, apiDataID',
      mock: '++id, name, projectUuid, workSpaceUuid'
    });
    this.open();
    this.on('populate', () => this.populate());
  }

  private async populate() {
    await this.project.add({ uuid: 1, name: 'Default' });
    await this.apiData.bulkAdd(sampleApiData, { allKeys: true });
  }
}

export const dataSource = new DataSource();
