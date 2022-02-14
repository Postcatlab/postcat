import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiDetailHeaderComponent } from './api-detail-header.component';

describe('ApiDetailHeaderComponent', () => {
  let component: ApiDetailHeaderComponent;
  let fixture: ComponentFixture<ApiDetailHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiDetailHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiDetailHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
