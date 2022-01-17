import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiGroupTreeComponent } from './api-group-tree.component';

describe('ApiGroupTreeComponent', () => {
  let component: ApiGroupTreeComponent;
  let fixture: ComponentFixture<ApiGroupTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiGroupTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiGroupTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
