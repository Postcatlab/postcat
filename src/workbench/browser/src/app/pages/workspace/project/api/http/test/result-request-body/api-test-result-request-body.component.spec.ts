import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiTestResultRequestBodyComponent } from './api-test-result-request-body.component';

describe('ApiTestResultRequestBodyComponent', () => {
  let component: ApiTestResultRequestBodyComponent;
  let fixture: ComponentFixture<ApiTestResultRequestBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApiTestResultRequestBodyComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiTestResultRequestBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
