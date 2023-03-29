import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLogComponent } from './update-log.component';

describe('UpdateLogComponent', () => {
  let component: UpdateLogComponent;
  let fixture: ComponentFixture<UpdateLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateLogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
