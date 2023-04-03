import { PageDto } from 'pc/browser/src/app/services/storage/db/dto/common.dto';
import { CollectionTypeEnum, Environment, Group } from 'pc/browser/src/app/services/storage/db/models';
import { ApiData } from 'pc/browser/src/app/services/storage/db/models/apiData';

export interface ProjectBulkCreateDto {
  projectMsgs: ProjectMsg[];
  workSpaceUuid: string;
}

export interface ProjectMsg {
  name: string;
  description?: string;
}

export interface ProjectDeleteDto {
  projectUuids: string[];
}

export interface ProjectUpdateDto {
  projectUuid: string;
  name: string;
  description: string;
}

export interface ProjectPageDto extends PageDto {
  projectUuids?: string[];
}

export interface ImportProjectDto {
  environmentList: Environment[];
  collections: Collection[];
  projectUuid?: string;
  workSpaceUuid?: string;
}
export type Collection = ApiData | Group;
export type ImportCollection = Collection & {
  /**
   * 0：group
   * 1: apiData
   */
  collectionType: CollectionTypeEnum;
};
