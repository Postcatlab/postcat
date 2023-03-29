import { DbApiCaseService } from 'pc/browser/src/app/services/storage/db/services/apiCase.service';

import { DbApiDataService } from './services/apiData.service';
import { DbApiTestHistoryService } from './services/apiTestHistory.service';
import { DbEnvironmentService } from './services/environment.service';
import { DbGroupService } from './services/group.service';
import { DbMockService } from './services/mock.service';
import { DbProjectService } from './services/project.service';
import { DbWorkspaceService } from './services/workspace.service';

export const db = {
  apiData: new DbApiDataService(),
  group: new DbGroupService(),
  environment: new DbEnvironmentService(),
  project: new DbProjectService(),
  workspace: new DbWorkspaceService(),
  mock: new DbMockService(),
  apiCase: new DbApiCaseService(),
  apiTestHistory: new DbApiTestHistoryService()
} as const;

if (process.env.NODE_ENV === 'development') {
  // const module = await import('./tests/index');
  // module.setupTests();
}
