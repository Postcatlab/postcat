export interface GroupDeleteDto {
  id?: number;
  projectUuid: string;
  workSpaceUuid: string;
}

export interface GroupCreateDto {
  name: string;
  type?: GroupType;
  module?: GroupModuleType;
  path?: string;
  depth?: number;
  parentId?: number;
  sort?: number;
  projectUuid?: string;
  workSpaceUuid?: string;
}
export enum GroupType {
  system = 0,
  /**
   * Folder group,created by user
   */
  userCreated = 1,
  /**
   * Case/mock/api, virtual group
   */
  virtual = 2
}
export enum GroupModuleType {
  api = 'API_DOC',
  case = 'API_CASE',
  mock = 'API_MOCK'
}
export interface GroupUpdateDto extends GroupCreateDto {
  id: number;
}
