import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActionComponent } from 'pc/browser/src/app/pages/workspace/project/api/http/action/action.component';
@NgModule({
  declarations: [ActionComponent],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ActionComponent
      }
    ]),
    CommonModule
  ]
})
export class ActionModule {}
