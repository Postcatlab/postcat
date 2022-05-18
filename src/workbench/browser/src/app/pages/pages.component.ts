import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { SidebarService } from '../shared/components/sidebar/sidebar.service';

@Component({
  selector: 'eo-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  loadedIframe = false;
  iframeSrc: SafeResourceUrl;
  constructor(private cdRef: ChangeDetectorRef, public sidebar: SidebarService) {}
  ngOnInit(): void {
    this.watchSidebarItemChange();
  }
  private watchSidebarItemChange() {
    this.sidebar.appChanged$.subscribe(() => {
      this.loadedIframe = false;
      if (!this.sidebar.currentModule.isOffical) {
        setTimeout(() => {
          //add loading
          this.loadedIframe = false;
          let iframe = document.getElementById('app_iframe') as HTMLIFrameElement;
          //load resource
          iframe.src = this.sidebar.currentModule.main;
          //loading finish
          iframe.onload = () => {
            this.loadedIframe = true;
            this.cdRef.detectChanges();
          };
        }, 0);
      }
    });
  }
}
