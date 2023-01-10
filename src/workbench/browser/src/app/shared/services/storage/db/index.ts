import { ApiDataService } from './services/apiData.service';
import { ApiTestHistoryService } from './services/apiTestHistory.service';
import { EnvironmentService } from './services/environment.service';
import { GroupService } from './services/group.service';
import { ProjectService } from './services/project.service';

export const db = {
  apiData: new ApiDataService(),
  group: new GroupService(),
  environment: new EnvironmentService(),
  project: new ProjectService(),
  apiTestHistory: new ApiTestHistoryService()
} as const;

queueMicrotask(async () => await import('./tests/index'));
