import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { APP_CONFIG } from 'pc/browser/src/environments/environment';

import { StoreService } from '../../../store/state.service';
import { NpsPositionDirective } from '../nps-mask-postion.directive';

@Component({
  selector: 'pc-nps-mask',
  template: `<ng-container pcNpsPosition>
    <!-- <div i18n class="title">How would you rate your experience with the Postcat</div> -->
    <div class="tips text-tips"></div>
  </ng-container> `,
  styleUrls: ['./nps-mask.component.scss']
  // hostDirectives: [NpsPositionDirective]
})
export class NpsMaskComponent implements OnInit {
  /**
   * After durantion,the NPS will show
   *
   * In development mode,it will show immediately
   */
  duration = APP_CONFIG.production ? 60 : 0;
  constructor(private store: StoreService) {}
  ngOnInit(): void {
    this.bindUserID();

    //* Trigger NPS after wondering 30 seconds
    setTimeout(() => {
      this.showNps();
    }, this.duration * 1000);
  }
  bindUserID() {
    const userProfile = this.store.getUserProfile;
    //@ts-ignore
    _howxm('identify', {
      uid: userProfile?.id,
      email: userProfile?.email
    });
  }
  private showNps() {
    //@ts-ignore
    _howxm('event', 'show_nps', {});
  }
}
