import { Injectable } from '@angular/core';
import { ApiTabOperateService } from 'eo/workbench/browser/src/app/pages/api/tab/api-tab-operate.service';
import { Message, MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
@Injectable()
export class ApiTabService {
  constructor(private tabOperate: ApiTabOperateService, private messageService: MessageService) {
  }
  init(){
    this.operateTabAfterApiChange();
  }
  /**
   * Operate tab from api change which router no change
   * Such as delete api
   */
  private operateTabAfterApiChange() {
    this.messageService.get().subscribe((inArg: Message) => {
      switch (inArg.type) {
        case 'deleteApiSuccess': {
          this.tabOperate.batchClose(inArg.data.uuids);
          break;
        }
      }
    });
  }
}
