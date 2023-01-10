import { ApiDataService } from './apiData.service';
import { ApiTestHistoryService } from './apiTestHistory.service';
import { EnvironmentService } from './environment.service';
import { GroupService } from './group.service';
import { ProjectService } from './project.service';

export const db = {
  apiData: new ApiDataService(),
  group: new GroupService(),
  environment: new EnvironmentService(),
  project: new ProjectService(),
  apiTestHistory: new ApiTestHistoryService()
} as const;

queueMicrotask(async () => await import('./tests/index'));
