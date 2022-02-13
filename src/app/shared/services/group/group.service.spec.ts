import { TestBed } from '@angular/core/testing';
import { StorageModule } from '../../../modules/storage/storage.module';
import { StorageService } from '../../../modules/storage/storage.service';
import { storageSettingData } from '../../models/storageSetting.model';
import { GroupService } from './group.service';

describe('GroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StorageModule.forRoot({ setting: storageSettingData })],
      providers: [GroupService, StorageService],
    });
  });

  it('should be created', () => {
    const groupService: GroupService = TestBed.inject(GroupService);
    expect(groupService).toBeTruthy();
  });
});
