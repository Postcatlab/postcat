import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  isShare = this.countShare();
  constructor(private router: Router) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((res: NavigationEnd) => {
      this.countShare();
    });
  }
  countShare() {
    const { url } = this.router;
    if (url.includes('/home/share')) {
      this.isShare = true;
      return true;
    }
    this.isShare = false;
    return false;
  }
}
