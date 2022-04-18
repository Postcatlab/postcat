import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApiTestService } from '../api-test.service';

import { ApiTestQueryComponent } from './api-test-query.component';

describe('ApiTestQueryComponent', () => {
  let component: ApiTestQueryComponent;
  let fixture: ComponentFixture<ApiTestQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers:[ApiTestService],
      declarations: [ ApiTestQueryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiTestQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
