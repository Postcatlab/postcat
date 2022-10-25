import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'eo-share',
  template: `<section class="flex flex-col w-[300px] px-2">
    <eo-api></eo-api>
  </section>`
})
export class ShareComponent implements OnInit {
  constructor() {}
  async ngOnInit(): Promise<void> {}
}
