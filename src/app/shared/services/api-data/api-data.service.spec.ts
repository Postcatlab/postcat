import { TestBed } from '@angular/core/testing';
import { StorageModule } from '../../../modules/storage/storage.module';
import { StorageService } from '../../../modules/storage/storage.service';
import { storageSettingData } from '../../models/storageSetting.model';
import { ApiDataService } from './api-data.service';

describe('ApiDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StorageModule.forRoot({ setting: storageSettingData })],
      providers: [ApiDataService, StorageService],
    });
  });

  it('should be created', () => {
    const apiDataService: ApiDataService = TestBed.inject(ApiDataService);
    expect(apiDataService).toBeTruthy();
  });
});
