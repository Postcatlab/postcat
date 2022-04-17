import { TestBed } from '@angular/core/testing';

import { ApiTabService } from './api-tab.service';

describe('ApiTabService', () => {
  let service: ApiTabService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[ApiTabService]
    });
    service = TestBed.inject(ApiTabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
