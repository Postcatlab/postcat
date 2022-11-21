import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetShareLinkComponent } from './get-share-link.component';

describe('GetShareLinkComponent', () => {
  let component: GetShareLinkComponent;
  let fixture: ComponentFixture<GetShareLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetShareLinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetShareLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
