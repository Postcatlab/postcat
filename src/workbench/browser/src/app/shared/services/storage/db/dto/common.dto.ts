export interface CommonDto {
  workSpaceUuid: string;
}

export interface PageDto extends CommonDto {
  page?: number;
  pageSize?: number;
}
