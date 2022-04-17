import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApiTestService } from '../api-test.service';

import { ApiTestHeaderComponent } from './api-test-header.component';

describe('ApiTestHeaderComponent', () => {
  let component: ApiTestHeaderComponent;
  let fixture: ComponentFixture<ApiTestHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers:[ApiTestService],
      declarations: [ ApiTestHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiTestHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
