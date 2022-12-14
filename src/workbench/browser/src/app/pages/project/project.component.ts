import { Component, OnInit } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { StorageRes, StorageResStatus } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';

type ListType = 'list' | 'card';

@Component({
  selector: 'project-management',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  listType: ListType = 'list';
  initLoading = true; // bug
  loadingMore = false;
  projectList: any[] = [];

  constructor(private msg: EoNgFeedbackMessageService, private storage: StorageService, private store: StoreService) {}

  ngOnInit(): void {
    this.getProjectList();
  }

  getProjectList() {
    this.storage.run('projectBulkLoad', [this.store.getCurrentWorkspace.id], (result: StorageRes) => {
      if (result.status === StorageResStatus.success) {
        this.projectList = result.data;
        this.initLoading = false;
      }
    });
  }

  editProject(item: any): void {
    console.log('item', item);
    this.msg.success(item.email);
  }

  delProject(item: any): void {
    this.msg.success(item.email);
  }

  setListType(type: ListType) {
    this.listType = type;
  }

  createProject() {}
}
