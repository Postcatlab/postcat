import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiGroupEditComponent } from './api-group-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from '../../../../shared/services/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

import { GroupService } from '../../../../shared/services/group/group.service';
import { StorageService } from '../../../../modules/storage/storage.service';
import { StorageModule } from '../../../../modules/storage/storage.module';
import { storageSettingData } from '../../../../shared/models/storageSetting.model';

describe('ApiGroupTreeComponent', () => {
  let component: ApiGroupEditComponent;
  let fixture: ComponentFixture<ApiGroupEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, StorageModule.forRoot({ setting: storageSettingData })],
      providers: [
        GroupService,
        MessageService,
        { provide: NzModalRef, useValue: {} },
        { provide: StorageService, useValue: {} },
      ],
      declarations: [ApiGroupEditComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiGroupEditComponent);
    component = fixture.componentInstance;
    component.group = {
      name: 'group-0',
      projectID: 0,
      parentID: 0,
      weight: 0,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
