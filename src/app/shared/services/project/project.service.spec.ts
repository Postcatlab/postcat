import { TestBed } from '@angular/core/testing';

import { ProjectService } from './project.service';

describe('ProjectService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    const projectService: ProjectService = TestBed.inject(ProjectService);
    expect(projectService).toBeTruthy();
  });
});
