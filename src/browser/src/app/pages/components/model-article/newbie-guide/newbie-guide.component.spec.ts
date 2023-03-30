import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewbieGuideComponent } from './newbie-guide.component';

describe('NewbieGuideComponent', () => {
  let component: NewbieGuideComponent;
  let fixture: ComponentFixture<NewbieGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewbieGuideComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NewbieGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
