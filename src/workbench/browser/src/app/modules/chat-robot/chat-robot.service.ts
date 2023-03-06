import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatRobotService {
  isShow: boolean = false;
  constructor() {}
  open() {
    this.isShow = true;
  }
  toggleShowStatus() {
    this.isShow = !this.isShow;
  }
}
