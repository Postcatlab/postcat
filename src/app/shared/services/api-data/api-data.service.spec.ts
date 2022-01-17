import { TestBed } from '@angular/core/testing';

import { ApiDataService } from './api-data.service';

describe('ApiDataService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    const apiDataService: ApiDataService = TestBed.inject(ApiDataService);
    expect(apiDataService).toBeTruthy();
  });
});
