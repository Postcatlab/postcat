import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { StatusService } from 'eo/workbench/browser/src/app/shared/services/status.service';

@Component({
  selector: 'eo-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  isShowNotification;
  constructor(public electron: ElectronService, private status: StatusService) {
    this.isShowNotification = false;
  }
  ngOnInit(): void {
  }
}
