import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtensionDetailComponent } from './extension-detail.component';

describe('ExtensionDetailComponent', () => {
  let component: ExtensionDetailComponent;
  let fixture: ComponentFixture<ExtensionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExtensionDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtensionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
