import { TestBed } from '@angular/core/testing';
import { StorageModule } from '../../../modules/storage/storage.module';

import { StorageService } from '../../../modules/storage/storage.service';
import { storageSettingData } from '../../models/storageSetting.model';
import { ProjectService } from './project.service';

describe('ProjectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StorageModule.forRoot({ setting: storageSettingData })],
      providers: [ProjectService, StorageService],
    });
  });

  it('should be created', () => {
    const projectService: ProjectService = TestBed.inject(ProjectService);
    expect(projectService).toBeTruthy();
  });
});
