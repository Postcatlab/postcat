import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiOverviewComponent } from './api-overview.component';

describe('ApiOverviewComponent', () => {
  let component: ApiOverviewComponent;
  let fixture: ComponentFixture<ApiOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
