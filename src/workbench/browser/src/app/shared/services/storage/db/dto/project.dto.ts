export interface ProjectBulkCreateDto {
  projectMsgs: ProjectMsg[];
  workSpaceUuid: string;
}

export interface ProjectMsg {
  name: string;
  description: string;
}

export interface ProjectDeleteDto {
  projectUuids: string[];
}

export interface ProjectUpdateDto {
  projectUuid: string;
  name: string;
  description: string;
}
export interface ProjectBulkReadDto {
  workSpaceUuid?: string;
  projectUuidS?: string[];
}
