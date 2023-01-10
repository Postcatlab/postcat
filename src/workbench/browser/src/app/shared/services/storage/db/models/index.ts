export type { ApiData } from './apiData';

interface Base {
  id?: number;
  uuid?: string;
}

export interface Workspace extends Base {
  title: string;
}

export interface Project extends Base {
  name: string;
  description?: string;
}

export interface Group extends Base {
  moduleGroupId: number;
  module: string;
  type: number;
  name: string;
  path: string;
  depth: number;
  parentId: number;
  sort: number;
  projectUuid: string;
  workSpaceUuid: string;
}

export interface Environment extends Base {
  name: string;
  hostUri: string;
  parameters: string;
  projectUuid: string;
  workSpaceUuid: string;
}
export interface Mock extends Base {
  name: string;
  description: string;
  response: string;
  projectUuid: string;
  workSpaceUuid: string;
}
export interface ApiTestHistory extends Base {
  apiUuid: string;
  general: string;
  request: string;
  response: string;
  projectUuid: string;
  workSpaceUuid: string;
}
