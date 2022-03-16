import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Message, MessageService } from '../../shared/services/message';
import { ApiService } from './api.service';

@Component({
  selector: 'eo-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss'],
})
export class ApiComponent implements OnInit, OnDestroy {
  /**
   * API uuid
   */
  id: number;

  TABS = [
    {
      routerLink: 'detail',
      title: '文档',
    },
    {
      routerLink: 'edit',
      title: '编辑',
    },
    {
      routerLink: 'test',
      title: '测试',
    },
  ];
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.watchChangeRouter();
    this.watchApiAction();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  watchApiAction(): void {
    this.messageService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((inArg: Message) => {
        switch (inArg.type) {
          case 'gotoCopyApi':
            this.apiService.copy(inArg.data);
            break;
          case 'gotoDeleteApi':
            this.apiService.delete(inArg.data);
            break;
          case 'gotoBulkDeleteApi':
            this.apiService.bulkDelete(inArg.data.uuids);
            break;
        }
      });
  }

  /**
   * Get current API ID to show content tab
   */
  watchChangeRouter() {
    this.id = Number(this.route.snapshot.queryParams.uuid);
    this.route.queryParamMap.subscribe((params) => {
      this.id = Number(params.get('uuid'));
    });
  }
  clickContentMenu(data) {
    this.messageService.send({ type: 'beforeChangeRouter', data: data });
  }
}
