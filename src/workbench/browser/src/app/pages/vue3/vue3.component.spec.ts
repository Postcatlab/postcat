import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vue3Component } from './vue3.component';

describe('Vue3Component', () => {
  let component: Vue3Component;
  let fixture: ComponentFixture<Vue3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Vue3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Vue3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
