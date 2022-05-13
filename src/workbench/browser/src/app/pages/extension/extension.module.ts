import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtensionComponent } from './extension/extension.component';
import { ExtensionListComponent } from './extension-list/extension-list.component';
import { ExtensionDetailComponent } from './extension-detail/extension-detail.component';



@NgModule({
  declarations: [
    ExtensionComponent,
    ExtensionListComponent,
    ExtensionDetailComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ExtensionModule { }
