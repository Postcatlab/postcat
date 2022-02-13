import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiGroupTreeComponent } from './api-group-tree.component';

import { StorageService } from '../../../../modules/storage/storage.service';
import { storageSettingData } from '../../../../shared/models/storageSetting.model';
import { StorageModule } from '../../../../modules/storage/storage.module';

import { ApiDataService } from '../../../../shared/services/api-data/api-data.service';
import { MessageService } from '../../../../shared/services/message';
import { GroupService } from '../../../../shared/services/group/group.service';

import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ModalService } from '../../../../shared/services/modal.service';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { of } from 'rxjs';

describe('ApiGroupTreeComponent', () => {
  let component: ApiGroupTreeComponent;
  let fixture: ComponentFixture<ApiGroupTreeComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        NzModalModule,
        NzMenuModule,
        NzTreeModule,
        NzDropDownModule,
        StorageModule.forRoot({ setting: storageSettingData }),
      ],
      providers: [
        GroupService,
        {
          provide: Router,
          useValue: {
            url: '/home/api/test?uuid=1',
            events: of(
              new NavigationEnd(
                0,
                'http://localhost:4200/home/api/test',
                'http://localhost:4200/home/api/test?uuid=1',
              )
            ),
            navigate: jasmine.createSpy('navigate'),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParams: { id: 1 } },
          },
        },
        ModalService,
        ApiDataService,
        MessageService,
        StorageService,
      ],
      declarations: [ApiGroupTreeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiGroupTreeComponent);
    component = fixture.componentInstance;
    component.treeNodes = [
      {
        title: 'parent 1',
        key: '100',
        children: [
          {
            title: 'parent 1-0',
            key: '1001',
            disabled: true,
            children: [
              { title: 'leaf 1-0-0', key: '10010', disableCheckbox: true, isLeaf: true },
              { title: 'leaf 1-0-1', key: '10011', isLeaf: true },
            ],
          },
          {
            title: 'parent 1-1',
            key: '1002',
            children: [
              { title: 'leaf 1-1-0', key: '10020', isLeaf: true },
              { title: 'leaf 1-1-1', key: '10021', isLeaf: true },
            ],
          },
        ],
      },
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
