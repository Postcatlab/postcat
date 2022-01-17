import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiEditQueryComponent } from './api-edit-query.component';

describe('ApiEditQueryComponent', () => {
  let component: ApiEditQueryComponent;
  let fixture: ComponentFixture<ApiEditQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiEditQueryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiEditQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
