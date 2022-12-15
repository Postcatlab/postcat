import { Component, OnInit } from '@angular/core';

import { StoreService } from '../../../shared/store/state.service';

@Component({
  selector: 'eo-nav-breadcrumb',
  templateUrl: './nav-breadcrumb.component.html',
  styleUrls: ['./nav-breadcrumb.component.scss']
})
export class NavBreadcrumbComponent {
  constructor(public store: StoreService) {}
}
