import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiTestHistoryComponent } from './api-test-history.component';

describe('ApiTestHistoryComponent', () => {
  let component: ApiTestHistoryComponent;
  let fixture: ComponentFixture<ApiTestHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiTestHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiTestHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
