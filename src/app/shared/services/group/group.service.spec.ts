import { TestBed } from '@angular/core/testing';

import { GroupService } from './group.service';

describe('GroupService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    const groupService: GroupService = TestBed.inject(GroupService);
    expect(groupService).toBeTruthy();
  });
});
