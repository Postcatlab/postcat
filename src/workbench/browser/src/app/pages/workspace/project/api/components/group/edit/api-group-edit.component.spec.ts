import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';

import { MessageService } from '../../../../../../../shared/services/message';
import { StorageModule } from '../../../../modules/storage/storage.module';
import { StorageService } from '../../../../modules/storage/storage.service';
import { storageSettingData } from '../../../../shared/models/storageSetting.model';
import { GroupService } from '../../../../shared/services/group/group.service';
import { ApiGroupEditComponent } from './api-group-edit.component';

describe('ApiGroupTreeComponent', () => {
  let component: ApiGroupEditComponent;
  let fixture: ComponentFixture<ApiGroupEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, StorageModule.forRoot({ setting: storageSettingData })],
      providers: [GroupService, MessageService, { provide: NzModalRef, useValue: {} }, { provide: StorageService, useValue: {} }],
      declarations: [ApiGroupEditComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiGroupEditComponent);
    component = fixture.componentInstance;
    component.group = {
      name: 'group-0',
      projectID: 0,
      parentID: 0,
      weight: 0
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
