import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPeopleGuideComponent } from './new-people-guide.component';

describe('NewPeopleGuideComponent', () => {
  let component: NewPeopleGuideComponent;
  let fixture: ComponentFixture<NewPeopleGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewPeopleGuideComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NewPeopleGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
