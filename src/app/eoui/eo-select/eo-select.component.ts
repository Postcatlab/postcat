import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'eo-select',
  templateUrl: './eo-select.component.html',
  styleUrls: ['./eo-select.component.scss'],
})
export class EoSelectComponent implements OnInit {
  @Input() dataModel: any[] = [];
  @Input() model = '';
  @Output() modelChange = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {
    // console.log('->', this.model);
  }

  handleSelect(event) {
    this.modelChange.emit(event);
  }
}
