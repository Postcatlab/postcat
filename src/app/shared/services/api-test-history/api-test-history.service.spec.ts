import { TestBed } from '@angular/core/testing';
import { StorageModule } from '../../../modules/storage/storage.module';
import { StorageService } from '../../../modules/storage/storage.service';
import { storageSettingData } from '../../models/storageSetting.model';

import { ApiTestHistoryService } from './api-test-history.service';

describe('ApiTestHistoryService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StorageModule.forRoot({ setting: storageSettingData })],
      providers:[ApiTestHistoryService,StorageService]
    });
  });

  it('should be created', () => {
    const apiTestHistoryService: ApiTestHistoryService = TestBed.inject(ApiTestHistoryService);
    expect(apiTestHistoryService).toBeTruthy();
  });
});
