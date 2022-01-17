import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiTestResultResponseComponent } from './api-test-result-response.component';

describe('ApiTestResultResponseComponent', () => {
  let component: ApiTestResultResponseComponent;
  let fixture: ComponentFixture<ApiTestResultResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiTestResultResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiTestResultResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
