import Dexie, { Table } from 'dexie';
import { db } from 'eo/workbench/browser/src/app/shared/services/storage/db';
import { setupVersions } from 'eo/workbench/browser/src/app/shared/services/storage/db/dataSource/versions';
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
import { ProjectService } from 'eo/workbench/browser/src/app/shared/services/storage/db/services/project.service';
import { WorkspaceService } from 'eo/workbench/browser/src/app/shared/services/storage/db/services/workspace.service';
import { merge } from 'lodash-es';

class DataSource extends Dexie {
  workspace!: Table<Workspace, number>;
  project!: Table<Project, number>;
  group!: Table<Group, number>;
  environment!: Table<Environment, number>;
  apiData!: Table<ApiData, number>;
  apiTestHistory!: Table<ApiTestHistory, number>;
  mock!: Table<Mock, number>;
  constructor() {
    super('postcat_core_test');
    this.version(1).stores({
      workspace: '++id, &uuid, name',
      project: '++id, &uuid, name, workSpaceUuid',
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
    const workspaceService = new WorkspaceService();
    const projectService = new ProjectService();

    const { data: workspace } = await workspaceService.create({ title: 'Persional Workspace' });

    const { data: project } = await projectService.bulkCreate({ projectMsgs: [{ name: 'Default' }], workSpaceUuid: workspace.uuid });

    const params = { workSpaceUuid: workspace.uuid, projectUuid: project.at(0).uuid };

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
        // 创建不应该使用用户传入的 id
        Reflect.deleteProperty(obj, 'id');
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
          // 在数据返回到前端之前，将数据库中的 uuid 字段转为特定名称的 xxxUuid，这里主要是为了对齐后端返回的字段
          obj[uuidName] = obj.uuid;
        }
        if (table.name === 'workspace') {
          // 主要用于区分本地空间和远程空间
          obj.isLocal = true;
        }
        return obj;
      });
      table.hook('updating', (modifications, primKey, obj) => {
        const newObj = merge({}, obj, modifications);
        return { ...newObj, updateTime: Date.now() };
      });
    });
  }
}

export const dataSource = new DataSource();

export type DataSourceInstance = typeof dataSource;
