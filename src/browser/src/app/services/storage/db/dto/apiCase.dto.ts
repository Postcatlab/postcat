import { ApiCase } from 'pc/browser/src/app/services/storage/db/models';

export interface ApiCaseDeleteDto {
  apiCaseUuids?: number[];
  projectUuid: string;
  workSpaceUuid: string;
}

export interface ApiCaseCreateDto {
  apiCaseList: Partial<ApiCase[]>;
  projectUuid: string;
  workSpaceUuid: string;
}
export interface ApiCaseUpdateDto extends ApiCaseCreateDto {
  id: number;
}
