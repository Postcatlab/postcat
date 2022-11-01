import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';

@Component({
  selector: 'eo-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  isShowNotification;
  constructor(public electron: ElectronService) {
    this.isShowNotification = false;
  }
  ngOnInit(): void {
  }
}
