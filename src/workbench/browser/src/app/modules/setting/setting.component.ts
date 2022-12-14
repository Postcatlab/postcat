import { AfterViewInit, Component, ComponentRef, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WebService } from 'eo/workbench/browser/src/app/core/services';
import { AccountComponent } from 'eo/workbench/browser/src/app/modules/setting/common/account.component';
import { SettingService } from 'eo/workbench/browser/src/app/modules/setting/settings.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';

import { AboutComponent, DataStorageComponent, LanguageSwticherComponent, SelectThemeComponent } from './common';

interface TreeNode {
  title: string;
  id?: string;
  ifShow?: () => boolean;
  comp?: any;
  disabled?: boolean;
  configuration?: any[];
}

@Component({
  selector: 'eo-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit, OnDestroy {
  @Input() selectedModule: string;
  @ViewChild('options', { read: ViewContainerRef, static: true }) options: ViewContainerRef;
  private componentRefs: Array<ComponentRef<any>> = [];
  extensitonConfigurations: any[];
  objectKeys = Object.keys;
  selectedTabIndex;
  isClick = false;
  /** current configuration */
  currentConfiguration = [];
  /** current active configure */
  /** all configure */
  $settings = {};

  set settings(val) {
    this.$settings = val;
    this.handleSave();
  }

  get settings() {
    return this.$settings;
  }
  treeNodes: TreeNode[] = [
    {
      title: $localize`:@@Account:Account`,
      id: 'eoapi-account',
      ifShow: () => {
        return this.store.isLogin;
      },
      comp: AccountComponent
    },
    {
      title: $localize`:@@Theme:Theme`,
      id: 'eoapi-theme',
      comp: SelectThemeComponent
    },
    {
      title: $localize`:@@Cloud:Cloud Storage`,
      id: 'eoapi-common',
      comp: DataStorageComponent,
      ifShow: () => !this.webService.isWeb
    },
    {
      title: $localize`:@@Language:Language`,
      id: 'eoapi-language',
      comp: LanguageSwticherComponent
    },
    {
      title: $localize`About`,
      id: 'eoapi-about',
      comp: AboutComponent
    }
  ];
  /** local configure */
  localSettings = {};
  validateForm!: FormGroup;

  constructor(private settingService: SettingService, public store: StoreService, public webService: WebService) {}

  ngOnInit(): void {
    this.init();
  }
  updateView() {
    let selectModule = this.treeNodes.find(val => val.id === this.selectedModule);
    this.componentRefs.forEach(item => item.destroy());
    const componentRef = this.options.createComponent<any>(selectModule.comp as any);
    componentRef.location.nativeElement.id = selectModule.id;
    componentRef.instance.model = this.settings;
    componentRef.instance.modelChange?.subscribe(data => {
      Object.assign(this.settings, data);
      this.handleSave();
    });
    this.componentRefs.push(componentRef);
    console.log(this.componentRefs, this.selectedModule, this.options);
  }
  selectModule(id) {
    this.selectedModule = id;
    this.selectedTabIndex = this.treeNodes.filter(node => this.checkItemShow(node)).findIndex(node => node.id === id);
    this.updateView();
  }
  private handleSave = () => {
    this.settingService.saveSetting(this.settings);
    window.eo?.saveSettings?.({ ...this.settings });
  };
  checkItemShow(node) {
    return !node.ifShow || node.ifShow();
  }
  /**
   * Parse the configuration information of all modules
   */
  private init() {
    this.settings = this.localSettings = this.settingService.getSettings();
    const modules = window.eo?.getModules?.() || new Map([]);
    this.extensitonConfigurations = [...modules.values()]
      .filter(n => n.features?.configuration)
      .map(n => {
        const configuration = n.features.configuration;
        if (Array.isArray(configuration)) {
          configuration.forEach(m => (m.id ??= n.id));
        } else {
          configuration.id ??= n.id;
        }
        return configuration;
      });

    // The first item is selected by default
    let node = this.treeNodes.find(node => node.id === this.selectedModule && this.checkItemShow(node));
    if (this.selectedModule && !node) {
      eoConsole.error(`[eo-setting]: The selected module [${this.selectModule}] does not exist`);
    }
    node = node || this.treeNodes.find(node => this.checkItemShow(node));
    this.selectModule(node.id);
  }

  ngOnDestroy(): void {
    this.componentRefs.forEach(item => item.destroy());
  }
}
