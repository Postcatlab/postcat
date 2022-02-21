import { Injectable } from '@angular/core';
import { TestServerLocalNodeService } from './local-node/test-connect.service';
import { TestServerServerlessService } from './serverless-node/test-connect.service';
import { ElectronService } from '../../../core/services';
@Injectable()
export class TestServerService {
  isElectron = true;
  constructor(private electron: ElectronService, private localNode: TestServerLocalNodeService,private sassNode:TestServerServerlessService) {
    this.isElectron = this.electron.isElectron;
  }
  getService() {
    if (this.isElectron) {
      return this.localNode;
    } else {
      return this.sassNode;
    }
  }
}
