import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiGroupEditComponent } from './api-group-edit.component';

describe('ApiGroupTreeComponent', () => {
  let component: ApiGroupEditComponent;
  let fixture: ComponentFixture<ApiGroupEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiGroupEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiGroupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
