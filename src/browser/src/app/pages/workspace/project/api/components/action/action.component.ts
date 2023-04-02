import { Component } from '@angular/core';

interface OperationType {
  title: string;
  type: string;
}

@Component({
  selector: 'pc-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent {
  selectedIndex: number;
  operationArr: OperationType[] = [
    {
      title: $localize`Pre-request Script`,
      type: 'pre'
    },
    {
      title: $localize`After-response Script`,
      type: 'after'
    }
  ];
  type: string = 'pre';

  typeChange(type) {
    if (type === this.type) return;
    this.type = type;
  }
}
