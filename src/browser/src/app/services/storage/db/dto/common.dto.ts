export interface CommonDto {
  workSpaceUuid: string;
}

export interface QueryAllDto {
  projectUuid: string;
  workSpaceUuid?: string;
}

export interface PageDto extends CommonDto {
  page?: number;
  pageSize?: number;
}
