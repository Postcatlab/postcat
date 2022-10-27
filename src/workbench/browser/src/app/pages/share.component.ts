import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShareService } from 'eo/workbench/browser/src/app/shared/services/share.service';
import { StatusService } from 'eo/workbench/browser/src/app/shared/services/status.service';

@Component({
  selector: 'eo-share',
  template: `<section class="flex flex-col"><eo-api></eo-api></section>`,
})
export class ShareComponent implements OnInit {
  constructor(private route: ActivatedRoute, private share: ShareService, private status: StatusService) {}
  async ngOnInit(): Promise<void> {
    this.status.countShare();
    this.route.queryParams.subscribe(({ shareId }) => {
      this.share.setShareId(shareId);
    });
  }
}
