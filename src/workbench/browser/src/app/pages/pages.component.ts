import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../shared/components/sidebar/sidebar.service';

@Component({
  selector: 'eo-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  constructor(private sidebar: SidebarService) {}
  ngOnInit(): void {
    this.watchSidebarItemChange();
  }
  private watchSidebarItemChange() {
    this.sidebar.appChanged$.pipe().subscribe(() => {
      console.log(this.sidebar.currentModule);
    });
  }
}
