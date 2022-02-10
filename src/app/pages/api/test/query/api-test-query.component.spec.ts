import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiTestQueryComponent } from './api-test-query.component';

describe('ApiTestQueryComponent', () => {
  let component: ApiTestQueryComponent;
  let fixture: ComponentFixture<ApiTestQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiTestQueryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiTestQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
