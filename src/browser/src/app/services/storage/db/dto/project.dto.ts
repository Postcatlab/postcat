import { ApiList } from 'pc/browser/src/app/services/storage/db/dto/apiData.dto';
import { PageDto } from 'pc/browser/src/app/services/storage/db/dto/common.dto';
import { Environment, Group } from 'pc/browser/src/app/services/storage/db/models';

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

export type Collection = (ApiList | Group) & {
  /**
   * 0：group
   * 1: apiData
   */
  collectionType: CollectionTypeEnum;
};

export enum CollectionTypeEnum {
  GROUP = 0,
  API_DATA = 1
}
