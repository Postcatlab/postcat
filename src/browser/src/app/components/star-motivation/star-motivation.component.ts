import { Component, Input } from '@angular/core';
import { APP_CONFIG } from 'pc/browser/src/environments/environment';

import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'pc-star-motivation',
  template: ` <div class="flex flex-col items-center"
    ><p i18n class="text-center mt-[15px]">
      Hi!~ If you like <b>{{ subject }}</b
      >, please give the Postcat a Star!<br />Your support is our greatest motivation~
    </p>
    <a
      class="favor-image-link mt-[15px]"
      target="_blank"
      [href]="APP_CONFIG.GITHUB_REPO_URL"
      trace
      traceID="jump_to_github"
      [traceParams]="{ where_jump_to_github: 'heart' }"
    >
      <img loading="lazy" class="w-[40px] favor-image align-middle" src="assets/images/heart.png" />
    </a>
  </div>`,
  standalone: true,
  imports: [SharedModule],
  styles: [
    `
      .favor-image-link {
        background-color: #eee;
        border-radius: 50%;
        padding: 13px;
      }

      .favor-image {
        transition: all 0.3s;
      }
      .favor-image:hover {
        transform: scale(1.2);
      }
    `
  ]
})
export class StarMotivationComponent {
  @Input() subject: string = 'Postcat';

  readonly APP_CONFIG = APP_CONFIG;
}
