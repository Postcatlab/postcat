import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiTestRestComponent } from './api-test-rest.component';

describe('ApiTestRestComponent', () => {
  let component: ApiTestRestComponent;
  let fixture: ComponentFixture<ApiTestRestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiTestRestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiTestRestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
