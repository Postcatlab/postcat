import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { StoreService } from '../../store/state.service';

@Injectable()
export class RedirectSharedID implements CanActivate {
  constructor(private store: StoreService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const urlTree = this.router.parseUrl(state.url);
    if (!urlTree.queryParams.shareId && this.store.getShareID) {
      urlTree.queryParams.shareId = this.store.getShareID;
      return urlTree;
    }
    return true;
  }
}

@Injectable()
export class RedirectWorkspace implements CanActivate {
  constructor(private store: StoreService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const urlTree = this.router.parseUrl(state.url);
    if (!urlTree.queryParams.wid) {
      urlTree.queryParams.wid = this.store.getCurrentWorkspaceUuid;
      return urlTree;
    }
    return true;
  }
}

@Injectable()
export class RedirectProjectID implements CanActivate {
  constructor(private store: StoreService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const urlTree = this.router.parseUrl(state.url);
    if (!urlTree.queryParams.pid && this.store.getCurrentProjectID !== -1) {
      urlTree.queryParams.pid = this.store.getCurrentProjectID;
      return urlTree;
    }
    return true;
  }
}
