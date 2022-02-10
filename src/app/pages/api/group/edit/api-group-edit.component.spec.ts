import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiGroupEditComponent } from './api-group-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


describe('ApiGroupTreeComponent', () => {
  let component: ApiGroupEditComponent;
  let fixture: ComponentFixture<ApiGroupEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[FormsModule,ReactiveFormsModule],
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
