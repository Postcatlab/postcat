import { Component } from '@angular/core';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';

@Component({
  selector: 'eo-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent {
  isShowNotification;
  constructor(public electron: ElectronService) {
    this.isShowNotification = false;
  }
}
