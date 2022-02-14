import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasiApiEditParams } from '../../../../shared/services/api-data/api-edit-params.model';
import { ApiParamsExtraSettingComponent } from './api-params-extra-setting.component';

describe('ApiParamsExtraSettingComponent', () => {
  let component: ApiParamsExtraSettingComponent;
  let fixture: ComponentFixture<ApiParamsExtraSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApiParamsExtraSettingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiParamsExtraSettingComponent);
    component = fixture.componentInstance;
    component.model = Object.assign({} as BasiApiEditParams, { type: 'string' });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
