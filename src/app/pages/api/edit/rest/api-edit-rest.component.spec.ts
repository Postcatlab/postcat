import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalService } from '../../../../shared/services/modal.service';
import { ApiEditService } from '../api-edit.service';

import { ApiEditRestComponent } from './api-edit-rest.component';

export class MockModalService {}
describe('ApiEditRestComponent', () => {
  let component: ApiEditRestComponent;
  let fixture: ComponentFixture<ApiEditRestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [ApiEditService, { provide: ModalService, useClass: MockModalService }],
      declarations: [ApiEditRestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiEditRestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
