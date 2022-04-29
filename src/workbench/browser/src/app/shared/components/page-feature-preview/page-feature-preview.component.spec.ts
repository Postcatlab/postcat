import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageFeaturePreviewComponent } from './page-feature-preview.component';

describe('PageFeaturePreviewComponent', () => {
  let component: PageFeaturePreviewComponent;
  let fixture: ComponentFixture<PageFeaturePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageFeaturePreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageFeaturePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
