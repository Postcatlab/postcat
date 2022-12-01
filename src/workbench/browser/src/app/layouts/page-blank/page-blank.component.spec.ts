import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageBlankComponent } from './page-blank.component';

describe('PageBlankComponent', () => {
  let component: PageBlankComponent;
  let fixture: ComponentFixture<PageBlankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageBlankComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageBlankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
