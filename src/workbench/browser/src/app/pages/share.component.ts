import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ShareService } from 'eo/workbench/browser/src/app/shared/services/share.service';

@Component({
  selector: 'eo-share',
  template: `<section class="flex flex-col"><eo-api></eo-api></section>`,
})
export class ShareComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router, private share: ShareService) {}
  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(({ id }) => {
      this.share.setShareId(id);
      this.router.navigate(['/home/share/http/detail']);
    });
  }
}
