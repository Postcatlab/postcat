import { Injectable } from '@angular/core';
import { Storage, StorageInterface } from 'eoapi-core';

/**
 * eoapi-core storage
 */
@Injectable()
export class StorageService {

  private readonly _storage: StorageInterface;

  constructor() {
    this._storage = new Storage();
  }

  get storage() {
    return this._storage;
  }

}
