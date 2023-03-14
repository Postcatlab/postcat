import { ApiTestResData } from 'pc/browser/src/app/pages/workspace/project/api/service/test-server/test-server.model';

import { ApiData } from './apiData';

export type { ApiData } from './apiData';

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

export interface Group extends Base {
  type: number;
  name?: string;
  path?: string;
  depth?: number;
  parentId?: number;
  sort?: number;
  authInfo?: {
    authType: string;
    authInfo: string | Record<string, any>;
    isInherited?: 0 | 1;
  };
  projectUuid?: string;
  workSpaceUuid?: string;
  children?: Group[];
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
}
export interface ApiTestHistory extends Base {
  apiUuid?: string;
  request: Partial<ApiData>;
  response: ApiTestResData;
  projectUuid?: string;
  workSpaceUuid?: string;
}
