import { ApiDataService } from './services/apiData.service';
import { ApiTestHistoryService } from './services/apiTestHistory.service';
import { EnvironmentService } from './services/environment.service';
import { GroupService } from './services/group.service';
import { MockService } from './services/mock.service';
import { ProjectService } from './services/project.service';
import { WorkspaceService } from './services/workspace.service';

export const db = {
  apiData: new ApiDataService(),
  group: new GroupService(),
  environment: new EnvironmentService(),
  project: new ProjectService(),
  workspace: new WorkspaceService(),
  mock: new MockService(),
  apiTestHistory: new ApiTestHistoryService()
} as const;

if (process.env.NODE_ENV === 'development') {
  // const module = await import('./tests/index');
  // module.setupTests();
}
