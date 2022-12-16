import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphQlTestComponent } from './graph-ql-test.component';

describe('GraphQlTestComponent', () => {
  let component: GraphQlTestComponent;
  let fixture: ComponentFixture<GraphQlTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraphQlTestComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GraphQlTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
