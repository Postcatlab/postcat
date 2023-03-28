import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseStepsComponent } from './response-steps.component';

describe('ResponseStepsComponent', () => {
  let component: ResponseStepsComponent;
  let fixture: ComponentFixture<ResponseStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResponseStepsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ResponseStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
