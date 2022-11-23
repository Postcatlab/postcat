import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAccessComponent } from './manage-access.component';

describe('ManageAccessComponent', () => {
  let component: ManageAccessComponent;
  let fixture: ComponentFixture<ManageAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageAccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
