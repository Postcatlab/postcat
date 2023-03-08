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
  close() {
    this.isShow = false;
  }
  toggleShowStatus() {
    this.isShow = !this.isShow;
  }
}
