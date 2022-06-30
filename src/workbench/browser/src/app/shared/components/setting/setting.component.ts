import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { eoapiSettings } from './eoapi-settings/';
import { Message, MessageService } from '../../../shared/services/message';
import { Subject, takeUntil, debounceTime } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/remote/remote.service';
import { Router } from '@angular/router';

interface TreeNode {
  name: string;
  moduleID?: string;
  disabled?: boolean;
  children?: TreeNode[];
  configuration?: any[];
}

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  disabled: boolean;
}

@Component({
  selector: 'eo-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  @Input() set isShowModal(val) {
    this.$isShowModal = val;
    if (val) {
      this.init();
      this.remoteServerUrl = this.settings['eoapi-common.remoteServer.url'];
      this.remoteServerToken = this.settings['eoapi-common.remoteServer.token'];
      this.oldDataStorage = this.settings['eoapi-common.dataStorage'];
    } else {
      // this.handleSave();
    }
  }
  get isShowModal() {
    return this.$isShowModal;
  }
  @Output() isShowModalChange = new EventEmitter<any>();
  objectKeys = Object.keys;
  /** Whether the remote data source */
  get isRemote() {
    return this.remoteService.isRemote;
  }
  /** The text corresponding to the current data source */
  get dataSourceText() {
    return this.remoteService.dataSourceText;
  }
  private transformer = (node: TreeNode, level: number): FlatNode & TreeNode => ({
    ...node,
    expandable: !!node.children && node.children.length > 0,
    name: node.name,
    level,
    disabled: !!node.disabled,
  });
  selectListSelection = new SelectionModel<FlatNode & TreeNode>();
  treeControl: any = new FlatTreeControl<FlatNode & TreeNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new NzTreeFlattener(
    this.transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);
  switchDataSourceLoading = false;
  /** current configuration */
  currentConfiguration = [];
  // ! isVisible = false;
  $isShowModal = false;
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
  readonly treeNodes = [
    {
      name: $localize`Data Storage`,
      moduleID: 'eoapi-common',
    },
    {
      name: $localize`Language`,
      moduleID: 'eoapi-language',
    },
    {
      name: $localize`Extensions`,
      moduleID: 'eoapi-extensions',
    },
    {
      name: $localize`About`,
      moduleID: 'eoapi-about',
    },
  ];
  /** local configure */
  localSettings = {};
  validateForm!: FormGroup;
  /** remote server url */
  remoteServerUrl = '';
  /** remote server token */
  remoteServerToken = '';
  oldDataStorage = '';

  get selected() {
    return this.selectListSelection.selected.at(0)?.moduleID;
  }

  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private message: NzMessageService,
    private remoteService: RemoteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.init();
    // this.parseSettings();
    this.messageService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((inArg: Message) => {
        switch (inArg.type) {
          case 'toggleSettingModalVisible': {
            inArg.data.isShow ? this.handleShowModal() : this.handleCancel();
            break;
          }
          case 'onDataSourceChange': {
            if (inArg.data.showWithSetting) {
              this.remoteService.refreshComponent();
            }
            break;
          }
        }
      });
  }

  hasChild = (_: number, node: FlatNode): boolean => node.expandable;

  /**
   * switch data source
   */
  switchDataSource() {
    this.switchDataSourceLoading = true;
    this.remoteService.switchDataSource().finally(() => {
      this.switchDataSourceLoading = false;
    });
    // this.messageService.send({ type: 'switchDataSource', data: { showWithSetting: true } });
  }

  /**
   * set data
   *
   * @param properties
   */
  private setSettingsModel(properties, controls) {
    //  Flat configuration object
    Object.keys(properties).forEach((fieldKey) => {
      const props = properties[fieldKey];
      this.settings[fieldKey] = this.localSettings?.[fieldKey] ?? props.default;
      // Extensible to add more default checks
      if (props.required) {
        controls[fieldKey] = [null, [Validators.required]];
      } else {
        controls[fieldKey] = [null];
      }
    });
    // 深层嵌套的配置对象
    // Object.keys(properties).forEach((fieldKey) => {
    //   const keyArr = fieldKey.split('.');
    //   const keyArrL = keyArr.length - 1;
    //   keyArr.reduce((p, k, i) => {
    //     const isLast = i === keyArrL;
    //     p[k] ??= isLast ? this.settings[fieldKey] : {};
    //     return p[k];
    //   }, this.nestedSettings);
    //   // 当settings变化时，将值同步到nestedSettings
    //   Object.defineProperty(this.settings, fieldKey, {
    //     get: () => this.getConfiguration(fieldKey),
    //     set: (newVal) => {
    //       const target = keyArr.slice(0, -1).reduce((p, k) => p[k], this.nestedSettings);
    //       target[keyArr[keyArrL]] = newVal;
    //     },
    //   });
    // });
  }

  /**
   * Get the value of the corresponding configuration according to the key path
   *
   * @param key
   * @returns
   */
  getConfiguration(key: string) {
    // return key.split('.').reduce((p, k) => p?.[k], this.nestedSettings);
  }
  /**
   * Get the title of the module
   *
   * @param module
   * @returns
   */
  getModuleTitle(module: any): string {
    const title = module?.moduleName ?? module?.contributes?.title ?? module?.title;
    return title;
  }

  selectModule(node) {
    // console.log('selectModule', node);
    this.currentConfiguration = node.configuration || [];
    // console.log('this.currentConfiguration', this.currentConfiguration);
    this.selectListSelection.select(node);
  }

  /**
   * Parse the configuration information of all modules
   */
  private init() {
    // if (!window.eo && !window.eo?.getFeature) {
    //   return;
    // }
    // ! this.isVisible = true;
    // Get local settings
    this.settings = this.localSettings = this.remoteService.getSettings();
    // @ts-ignore
    window.getConfiguration = this.remoteService.getConfiguration;
    console.log('localSettings', this.localSettings);
    // const featureList = window.eo.getFeature('configuration');
    const modules = window.eo?.getModules() || new Map([]);
    // const extensitonConfigurations = [...modules.values()].filter((n) => n.contributes?.configuration);
    const extensitonConfigurations = [...modules.values()].filter((n) => n.features?.configuration);
    const controls = {};
    // All settings
    const allSettings = structuredClone([eoapiSettings['eoapi-extensions']]);
    // All configure
    const allConfiguration = allSettings.map((n) => {
      const configuration = n.features?.configuration || n.contributes?.configuration;
      if (Array.isArray(configuration)) {
        configuration.forEach((m) => (m.moduleID ??= n.moduleID));
      } else {
        configuration.moduleID ??= n.moduleID;
      }
      return configuration;
    });
    // 第三方扩展
    const extensionsModule = allSettings.find((n) => n.moduleID === 'eoapi-extensions');
    extensitonConfigurations.forEach((item) => {
      const configuration = item?.features?.configuration || item?.contributes?.configuration;
      if (configuration) {
        const extensionsConfiguration =
          extensionsModule.features?.configuration || extensionsModule.contributes?.configuration;
        configuration.title = item.moduleName ?? configuration.title;
        configuration.moduleID = item.moduleID;
        extensionsConfiguration.push(configuration);
      }
    });
    // Appends the module ID to the plug-in property
    const appendModuleID = (properties, moduleID) =>
      Object.keys(properties).reduce((prev, key) => {
        prev[`${moduleID}.${key}`] = properties[key];
        return prev;
      }, {});

    /** Generate settings model based on configuration configuration */
    allConfiguration.forEach((item) => {
      if (Array.isArray(item)) {
        item.forEach((n) => {
          n.properties = appendModuleID(n.properties, n.moduleID);
          this.setSettingsModel(n.properties, controls);
        });
      } else {
        item.properties = appendModuleID(item.properties, item.moduleID);
        this.setSettingsModel(item.properties, controls);
      }
    });
    type Configuration = typeof allConfiguration[number] | Array<typeof allConfiguration[number]>;
    // Recursively generate the setup tree
    const generateTreeData = (configurations: Configuration = []) =>
      [].concat(configurations).reduce<TreeNode[]>((prev, curr) => {
        if (Array.isArray(curr)) {
          return prev.concat(generateTreeData(curr));
        }
        const treeItem: TreeNode = {
          name: curr.title,
          configuration: [].concat(curr),
        };
        return prev.concat(treeItem);
      }, []);
    // All settings
    const treeData = structuredClone(this.treeNodes);
    const extensions = treeData.find((n) => n.moduleID === 'eoapi-extensions');
    const extensionConfiguration = allSettings[0].features?.configuration || allSettings[0].contributes?.configuration;
    extensions.children = generateTreeData(extensionConfiguration);
    extensions.configuration = extensionConfiguration;
    this.dataSource.setData(treeData);
    this.treeControl.expandAll();
    this.validateForm = this.fb.group(controls);
    this.validateForm.valueChanges.pipe(debounceTime(300)).subscribe(this.handleSave);
    // The first item is selected by default
    this.selectModule(this.treeControl.dataNodes.at(0));
  }

  navToExtensionList() {
    this.router.navigate(['home/extension/list'], {
      queryParams: { type: 'all' },
    });
    this.handleCancel();
  }
  handleShowModal() {
    this.isShowModal = true;
  }

  handleSave = () => {
    // for (const i in this.validateForm.controls) {
    //   if (this.validateForm.controls.hasOwnProperty(i)) {
    //     this.validateForm.controls[i].markAsDirty();
    //     this.validateForm.controls[i].updateValueAndValidity();
    //   }
    // }
    // if (this.validateForm.status === 'INVALID') {
    //   return;
    // }
    localStorage.setItem('localSettings', JSON.stringify(this.settings));
    window.eo?.saveSettings?.({ ...this.settings });
  };

  async handleCancel() {
    try {
      const isUpdateRemoteInfo =
        this.remoteServerUrl !== this.settings['eoapi-common.remoteServer.url'] ||
        this.remoteServerToken !== this.settings['eoapi-common.remoteServer.token'] ||
        this.oldDataStorage !== this.settings['eoapi-common.dataStorage'];

      if (isUpdateRemoteInfo) {
        this.message.success(
          'You have modified the data source related information, the page will refresh in 2 seconds...'
        );
        setTimeout(() => {
          this.remoteService.switchDataSource();
          this.remoteService.refreshComponent();
        }, 2000);
      }
    } catch (error) {
    } finally {
      this.handleSave();

      this.isShowModal = false;
      this.isShowModalChange.emit(false);
    }
  }
}
