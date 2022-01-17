import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiEditRestComponent } from './api-rest.component';

describe('ApiEditRestComponent', () => {
  let component: ApiEditRestComponent;
  let fixture: ComponentFixture<ApiEditRestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiEditRestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiEditRestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
