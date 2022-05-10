import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SidebarService } from '../shared/components/sidebar/sidebar.service';

@Component({
  selector: 'eo-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  loadedIframe = false;
  constructor(private cdRef: ChangeDetectorRef, public sidebar: SidebarService) {}
  ngOnInit(): void {
    this.watchSidebarItemChange();
  }
  private watchSidebarItemChange() {
    this.sidebar.appChanged$.pipe().subscribe(() => {
      this.loadedIframe = false;
      if (!this.sidebar.currentModule.isOffical) {
        //add loading
        setTimeout(() => {
          let iframe = document.getElementById('app_iframe') as HTMLIFrameElement;
          //add auto script
          let iframeDocument = iframe.contentWindow.document;
          var el = iframeDocument.createElement('script');
          el.text = `window.eo=window.parent.eo;\n`;
          iframeDocument.body.appendChild(el);
          //loading finish
          iframe.onload = () => {
            this.loadedIframe = true;
            this.cdRef.detectChanges(); // solution
          };
        }, 0);
      }
    });
  }
}
