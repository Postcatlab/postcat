import { AuthInfo } from 'pc/browser/src/app/pages/workspace/project/api/constants/auth.model';
import { ApiTestResData } from 'pc/browser/src/app/pages/workspace/project/api/service/test-server/test-server.model';
import { ApiData } from 'pc/browser/src/app/services/storage/db/models/apiData';

export enum GroupType {
  /**
   * System default group,such as root group
   */
  System = 0,
  /**
   * Folder group,created by user
   */
  UserCreated = 1,
  /**
   * Case/mock/api, virtual group
   */
  Virtual = 2
}
export enum GroupModuleType {
  API = 'API_DOC',
  Case = 'API_CASE',
  Mock = 'API_MOCK'
}
export enum CollectionTypeEnum {
  Group = 0,
  API = 1
}

interface Base {
  id?: number;
  uuid?: string;
  createTime?: number;
  updateTime?: number;
}

export interface Workspace extends Base {
  title: string;
  isLocal?: boolean;
}

export interface Project extends Base {
  name: string;
  projectUuid: string;
  workSpaceUuid: string;
  description?: string;
}
export interface ProjectSyncSetting extends Base {
  pluginId: string;
  projectUuid: string;
  workSpaceUuid: string;
  crontab?: number;
  pluginSettingJson?: string;
}
export interface Environment extends Base {
  name: string;
  hostUri: string;
  parameters: any | string;
  projectUuid: string;
  workSpaceUuid: string;
}
export interface Mock extends Base {
  name: string;
  apiUuid: string;
  description: string;
  createWay: 'system' | 'custom';
  response: string;
  projectUuid: string;
  workSpaceUuid: string;
  uri: string;
}
export interface ApiTestHistory extends Base {
  apiUuid?: string;
  request: Partial<ApiData>;
  response: ApiTestResData;
  projectUuid?: string;
  workSpaceUuid?: string;
}
export interface ApiCase extends ApiData, Base {
  apiCaseUuid: number;
  apiUuid: string;
  projectUuid: string;
  workSpaceUuid: string;
}
export interface Group extends Base {
  type: number;
  name?: string;
  path?: string;
  depth?: number;
  parentId?: number;
  sort?: number;
  authInfo?: AuthInfo;
  projectUuid?: string;
  workSpaceUuid?: string;
  children?: Group[];
}

export interface ViewGroup {
  id: number;
  type: number;
  name?: string;
  depth?: number;
  parentId?: number;
  module: GroupModuleType;
  relationInfo?: any;
  children?: ViewGroup[];
  //For API
  method?: string;
  methodText?: string;
}
