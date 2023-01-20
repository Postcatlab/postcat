import { ApiList } from 'eo/workbench/browser/src/app/shared/services/storage/db/dto/apiData.dto';
import { PageDto } from 'eo/workbench/browser/src/app/shared/services/storage/db/dto/common.dto';
import { Environment, Group } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';

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
  apiList: ApiList[];
  groupList: Group[];
  name: string;
  projectUuid?: string;
  workSpaceUuid?: string;
}
