import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSettingComponent } from './project-setting.component';

describe('ProjectSettingComponent', () => {
  let component: ProjectSettingComponent;
  let fixture: ComponentFixture<ProjectSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectSettingComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
