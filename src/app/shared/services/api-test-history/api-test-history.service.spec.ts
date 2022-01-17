import { TestBed } from '@angular/core/testing';

import { ApiTestHistoryService } from './api-test-history.service';

describe('ApiTestHistoryService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    const apiTestHistoryService: ApiTestHistoryService = TestBed.inject(ApiTestHistoryService);
    expect(apiTestHistoryService).toBeTruthy();
  });
});
