import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'eo-workspace',
  template: `<div i18n>Workspace Operate</div>
    <div i18n>Edit Workspace</div>
    <button nz-button nzType="primary" (click)="btnqwl5jnCallback()" i18n>Save</button>
    <div i18n>Delete Workspace</div>
    <button nz-button nzType="primary" nzDanger (click)="btnvq75tnCallback()" i18n>Delete</button>`,
})
export class WorkspaceComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
  async btnqwl5jnCallback() {}
  async btnvq75tnCallback() {}
}
