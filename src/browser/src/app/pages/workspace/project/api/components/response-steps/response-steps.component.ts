import { Component } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { SharedModule } from 'pc/browser/src/app/shared/shared.module';

interface stepType {
  status: 'success' | 'fail' | 'loading' | 'non-execution';
  title: string;
  description: string;
}

@Component({
  standalone: true,
  selector: 'pc-response-steps',
  templateUrl: './response-steps.component.html',
  styleUrls: ['./response-steps.component.scss'],
  imports: [NzStepsModule, SharedModule, NzSpinModule, NzIconModule]
})
export class ResponseStepsComponent {
  stepArr: stepType[] = [
    {
      title: 'aa',
      status: 'loading',
      description: '你好呀'
    },
    {
      title: 'bb',
      status: 'success',
      description: '你好呀'
    },
    {
      title: 'cc',
      status: 'fail',
      description: '你好呀'
    }
  ];
}
