import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';

@Component({
  selector: 'eo-share',
  template: `<section class="flex flex-col">
    <eo-api></eo-api>
  </section>`,
})
export class ShareComponent implements OnInit {
  constructor(private route: ActivatedRoute, private store: StoreService) {}
  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(({ shareId }) => {
      this.store.setShareId(shareId);
    });
  }
}
