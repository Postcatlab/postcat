import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiToApiComponent } from './ai-to-api.component';

describe('AiToApiComponent', () => {
  let component: AiToApiComponent;
  let fixture: ComponentFixture<AiToApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AiToApiComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AiToApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
