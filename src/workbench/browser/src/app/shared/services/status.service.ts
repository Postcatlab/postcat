import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  isShare = true;
  constructor(private router: Router) {
    this.isShare = true;
  }
  countShare() {
    const { url } = this.router;
    if (url.includes('/home/share')) {
      this.isShare = true;
      return;
    }
    this.isShare = false;
  }
}
