import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApiEditService } from '../api-edit.service';

import { ApiEditHeaderComponent } from './api-edit-header.component';

describe('ApiEditHeaderComponent', () => {
  let component: ApiEditHeaderComponent;
  let fixture: ComponentFixture<ApiEditHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers:[ApiEditService],
      declarations: [ ApiEditHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiEditHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
