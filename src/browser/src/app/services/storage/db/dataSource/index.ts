import Dexie, { Table } from 'dexie';
import { merge } from 'lodash-es';
import { setupVersions } from 'pc/browser/src/app/services/storage/db/dataSource/versions';
import {
  Workspace,
  Project,
  Group,
  ApiData,
  Environment,
  ApiTestHistory,
  Mock,
  ProjectSyncSetting
} from 'pc/browser/src/app/services/storage/db/models';
import { ProjectService } from 'pc/browser/src/app/services/storage/db/services/project.service';
import { WorkspaceService } from 'pc/browser/src/app/services/storage/db/services/workspace.service';

class DataSource extends Dexie {
  workspace!: Table<Workspace, number>;
  project!: Table<Project, number>;
  projectSyncSetting!: Table<ProjectSyncSetting, number>;
  group!: Table<Group, number>;
  environment!: Table<Environment, number>;
  apiData!: Table<ApiData, number>;
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
    const workspaceService = new WorkspaceService();
    const projectService = new ProjectService();

    const {
      data: { uuid: workSpaceUuid }
    } = await workspaceService.create({ title: $localize`Personal Workspace` });

    await projectService.bulkCreate({ projectMsgs: [{ name: 'Default' }], workSpaceUuid }, true);
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
          obj['uuid'] ??= crypto.randomUUID();
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
        return { ...modifications, updateTime: Date.now() };
      });
    });
  }
}

export const dataSource = new DataSource();

export type DataSourceInstance = typeof dataSource;
