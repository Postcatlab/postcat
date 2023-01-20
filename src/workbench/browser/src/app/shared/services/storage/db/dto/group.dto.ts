export interface GroupDeleteDto {
  id?: number;
  projectUuid: string;
  workSpaceUuid: string;
}

export interface GroupCreateDto {
  name: string;
  type?: number;
  path?: string;
  depth?: number;
  parentId?: number;
  sort?: number;
  projectUuid?: string;
  workSpaceUuid?: string;
}

export interface GroupUpdateDto extends GroupCreateDto {
  id: number;
}
