import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiDetailRestComponent } from './api-detail-rest.component';

describe('ApiDetailRestComponent', () => {
  let component: ApiDetailRestComponent;
  let fixture: ComponentFixture<ApiDetailRestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiDetailRestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiDetailRestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
