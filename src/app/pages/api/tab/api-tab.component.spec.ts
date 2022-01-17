import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiTabComponent } from './api-tab/api-tab.component';

describe('ApiTabComponent', () => {
  let component: ApiTabComponent;
  let fixture: ComponentFixture<ApiTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
