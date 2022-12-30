import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtensionListComponent } from './extension-list.component';

describe('ExtensionListComponent', () => {
  let component: ExtensionListComponent;
  let fixture: ComponentFixture<ExtensionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExtensionListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtensionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
