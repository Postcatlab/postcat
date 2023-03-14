import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from 'pc/browser/src/app/store/state.service';

@Component({
  selector: 'eo-share',
  template: `<section class="flex flex-col">
    <pc-share-navbar></pc-share-navbar>
    <eo-api class="home-container"></eo-api>
  </section>`,
  styleUrls: ['./share-project.component.scss']
})
export class ShareComponent implements OnInit {
  constructor(private route: ActivatedRoute, private store: StoreService) {}
  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(({ shareId }) => {
      this.store.setShareId(shareId);
    });
  }
}
