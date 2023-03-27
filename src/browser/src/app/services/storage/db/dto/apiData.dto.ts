import { ApiData } from 'pc/browser/src/app/services/storage/db/models/apiData';

export interface ApiDataBulkCreateDto {
  apiList: Partial<ApiData[]>;
  projectUuid: string;
  workSpaceUuid: string;
}

export interface ApiDataUpdateDto {
  api: Partial<ApiData>;
  projectUuid: string;
  workSpaceUuid: string;
}

export interface ApiDataPageDto {
  projectUuid: string;
  workSpaceUuid: string;
  groupIds?: number[];
  keyword?: string;
  /** 排序正逆 ASC DESC(默认) */
  sort?: string;
  /** 排序字段 默认api_update_time */
  order?: string;
  page?: number;
  pageSize?: number;
}

export interface ApiDataBulkReadDto {
  projectUuid: string;
  workSpaceUuid?: string;
}

export interface ApiDataBulkReadDetailDto {
  apiUuids: string[];
  projectUuid: string;
  workSpaceUuid: string;
}

export interface ApiDataDeleteDto {
  apiUuids: string[];
  projectUuid: string;
  workSpaceUuid: string;
}
