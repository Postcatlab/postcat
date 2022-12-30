import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiScriptComponent } from './api-script.component';

describe('ApiScriptComponent', () => {
  let component: ApiScriptComponent;
  let fixture: ComponentFixture<ApiScriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApiScriptComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ApiScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
