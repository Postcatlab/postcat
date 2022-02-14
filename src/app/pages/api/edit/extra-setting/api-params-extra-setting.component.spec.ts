import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiParamsExtraSettingComponent } from './api-params-extra-setting.component';

describe('ApiParamsExtraSettingComponent', () => {
  let component: ApiParamsExtraSettingComponent;
  let fixture: ComponentFixture<ApiParamsExtraSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiParamsExtraSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiParamsExtraSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
