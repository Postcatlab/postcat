import { Injectable } from '@angular/core';
import { EO, EOInterface } from 'eoapi-core';

/**
 * eoapi-core服务
 */
@Injectable()
export class EOService {

  private readonly eo: EOInterface;

  constructor() {
    this.eo = new EO();
  }

  getEO(): EOInterface {
    return this.eo;
  }

  getStorage() {
    return this.eo.storage;
  }

}
