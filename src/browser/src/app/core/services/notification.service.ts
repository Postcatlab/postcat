import { Injectable } from '@angular/core';
import { ModalService } from 'pc/browser/src/app/services/modal.service';
import StorageUtil from 'pc/browser/src/app/shared/utils/storage/storage.utils';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private modal: ModalService) {}
  init() {
    const hasShow = StorageUtil.get('notification_has_show');
    if (hasShow) return;

    const logInfo = {
      startTime: new Date('2023-02-07 16:00:00'),
      endTime: new Date('2023-02-07 18:00:00')
    };
    const currentData = new Date();

    //Curent data is greater than end time
    if (currentData.getTime() > logInfo.endTime.getTime()) {
      return;
    }

    this.modal.create({
      stayWhenRouterChange: true,
      nzTitle: $localize`Release Notes`,
      nzContent: $localize`There will be downtime updates from ${logInfo.startTime.getHours()}\:00 to ${logInfo.endTime.getHours()}\:00 today, and may be temporarily inaccessible.`
    });
    StorageUtil.set('notification_has_show', true, 60 * 60 * 24);
  }
}
