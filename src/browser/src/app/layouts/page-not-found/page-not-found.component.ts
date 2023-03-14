import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'eo-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent {
  constructor(private router: Router) {}

  backHome() {
    this.router.navigate(['/home']);
  }
}
