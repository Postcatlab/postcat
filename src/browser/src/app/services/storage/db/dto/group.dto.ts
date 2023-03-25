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
   * folder group
   */
  userCreated = 1,
  /**
   * case/mock/api
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
