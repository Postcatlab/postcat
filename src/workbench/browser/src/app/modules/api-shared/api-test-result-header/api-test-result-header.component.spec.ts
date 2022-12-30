import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiTestResultHeaderComponent } from './api-test-result-header.component';

describe('ApiTestResultHeaderComponent', () => {
  let component: ApiTestResultHeaderComponent;
  let fixture: ComponentFixture<ApiTestResultHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApiTestResultHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiTestResultHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
