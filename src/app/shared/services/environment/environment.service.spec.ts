import { TestBed } from '@angular/core/testing';

import { StorageModule } from '../../../modules/storage/storage.module';
import { StorageService } from '../../../modules/storage/storage.service';
import { storageSettingData } from '../../models/storageSetting.model';

import { EnvironmentService } from './environment.service';

describe('EnvironmentService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StorageModule.forRoot({ setting: storageSettingData })],
      providers:[EnvironmentService,StorageService]
    });
  });

  it('should be created', () => {
    const environmentService: EnvironmentService = TestBed.inject(EnvironmentService);
    expect(environmentService).toBeTruthy();
  });
});
