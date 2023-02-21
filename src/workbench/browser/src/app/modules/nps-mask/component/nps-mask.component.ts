import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { StoreService } from '../../../shared/store/state.service';
import { NpsPositionDirective } from '../nps-mask-postion.directive';

@Component({
  selector: 'pc-nps-mask',
  template: `<ng-container pcNpsPosition>
    <div i18n class="title">How would you rate you experience with the Postcat</div>
    <div class="tips text-tips"></div>
  </ng-container> `,
  styleUrls: ['./nps-mask.component.scss'],
  hostDirectives: [NpsPositionDirective]
})
export class npsMaskComponent implements OnInit {
  constructor(private store: StoreService) {}
  ngOnInit(): void {
    this.bindUserID();
  }
  bindUserID() {
    const userProfile = this.store.getUserProfile;
    //@ts-ignore
    _howxm('identify', {
      uid: userProfile.id,
      email: userProfile.email
    });
  }
}
