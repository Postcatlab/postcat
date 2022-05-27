import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { debounce, cloneDeep } from 'lodash';
import { eoapiSettings } from './eoapi-settings/';
import { Message, MessageService } from '../../../shared/services/message';
import { Subject, takeUntil } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

interface TreeNode {
  name: string;
  title: string;
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
  objectKeys = Object.keys;
  dataSourceType = 'http';
  /** 是否远程数据源 */
  get isRemote() {
    return this.dataSourceType === 'http';
  }
  /** 当前数据源对应的文本 */
  get dataSourceText() {
    return this.isRemote ? '远程' : '本地';
  }
  private transformer = (node: TreeNode, level: number): FlatNode => ({
    ...node,
    expandable: !!node.children && node.children.length > 0,
    name: node.name,
    level,
    disabled: !!node.disabled,
  });
  selectListSelection = new SelectionModel<FlatNode>();

  treeControl = new FlatTreeControl<FlatNode>(
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

  /** 当前配置项 */
  currentConfiguration = [];
  isVisible = false;
  _isShowModal = false;
  /** 所有配置 */
  settings = {};
  /** 本地配置 */
  localSettings = { settings: {}, nestedSettings: {} };
  /** 深层嵌套的配置 */
  nestedSettings = {};
  validateForm!: FormGroup;
  /** 远程服务器地址 */
  remoteServerUrl = '';

  get isShowModal() {
    return this._isShowModal;
  }

  set isShowModal(val) {
    this._isShowModal = val;
    if (val) {
      this.init();
      this.remoteServerUrl = this.settings['eoapi-common.remoteServer.url'];
    } else {
      this.pingRmoteServerUrl();
    }
  }

  private destroy$: Subject<void> = new Subject<void>();
  constructor(private fb: FormBuilder, private messageService: MessageService, private message: NzMessageService) {}

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
            console.log('onDataSourceChange', inArg.data);
            this.dataSourceType = inArg.data.dataSourceType;
            inArg.data.showWithSetting && this.message.create('success', `成功切换到${this.dataSourceText}数据源`);
            break;
          }
        }
      });
  }

  hasChild = (_: number, node: FlatNode): boolean => node.expandable;

  /**
   * 切换数据源
   */
  switchDataSource() {
    console.log('switchDataSource', this.messageService);
    this.messageService.send({ type: 'switchDataSource', data: { showWithSetting: true } });
  }

  /**
   * 测试远程服务器地址是否可用
   */
  async pingRmoteServerUrl() {
    const remoteUrl = this.settings['eoapi-common.remoteServer.url'];
    try {
      const result = await fetch(remoteUrl);
      if (result.status < 200 || result.status > 300) {
        throw result;
      }
      await result.json();
      if (remoteUrl !== this.remoteServerUrl) {
        this.message.create('success', '远程服务器地址设置成功');
      }
    } catch (error) {
      console.error(error);
      if (remoteUrl !== this.remoteServerUrl) {
        this.message.create('error', '远程服务器地址不可用');
      }
      // 远程服务地址不可用时，回退到上次的地址
      this.settings['eoapi-common.remoteServer.url'] = this.remoteServerUrl;
    }
  }

  /**
   * 设置数据
   * @param properties
   */
  private setSettingsModel(properties, controls) {
    //  平级配置对象
    Object.keys(properties).forEach((fieldKey) => {
      const props = properties[fieldKey];
      this.settings[fieldKey] = this.localSettings?.settings?.[fieldKey] ?? props.default;
      // 可扩展加入更多默认校验
      if (props.required) {
        controls[fieldKey] = [null, [Validators.required]];
      } else {
        controls[fieldKey] = [null];
      }
    });
    // 深层嵌套的配置对象
    Object.keys(properties).forEach((fieldKey) => {
      const keyArr = fieldKey.split('.');
      const keyArrL = keyArr.length - 1;
      keyArr.reduce((p, k, i) => {
        const isLast = i === keyArrL;
        p[k] ??= isLast ? this.settings[fieldKey] : {};
        return p[k];
      }, this.nestedSettings);
      // 当settings变化时，将值同步到nestedSettings
      Object.defineProperty(this.settings, fieldKey, {
        get: () => {
          return this.getConfiguration(fieldKey);
        },
        set: (newVal) => {
          const target = keyArr.slice(0, -1).reduce((p, k) => p[k], this.nestedSettings);
          target[keyArr[keyArrL]] = newVal;
        },
      });
    });
  }

  /**
   * 根据key路径获取对应的配置的值
   * @param key
   * @returns
   */
  getConfiguration(key: string) {
    return key.split('.').reduce((p, k) => p[k], this.nestedSettings);
  }
  /**
   * 获取模块的标题
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
   * 解析所有模块的配置信息
   */
  private init() {
    if (!window.eo && !window.eo.getFeature) return;
    this.isVisible = true;
    this.settings = {};
    this.nestedSettings = {};
    // 获取本地设置
    this.localSettings = window.eo.getSettings();
    // const featureList = window.eo.getFeature('configuration');
    const modules = window.eo.getModules();
    const extensitonConfigurations = [...modules.values()].filter((n) => n.contributes?.configuration);
    const controls = {};
    // 所有设置
    const allSettings = cloneDeep([
      eoapiSettings['Eoapi-Common'],
      eoapiSettings['Eoapi-theme'],
      eoapiSettings['Eoapi-Extensions'],
      // eoapiSettings['Eoapi-Features'],
      eoapiSettings['Eoapi-about'],
    ]);
    // 所有配置
    const allConfiguration = allSettings.map((n) => {
      const configuration = n.contributes.configuration;
      if (!Array.isArray(configuration)) {
        configuration.moduleID ??= n.moduleID;
      }
      return configuration;
    });
    // 第三方扩展
    const extensionsModule = allSettings.find((n) => n.moduleID === 'Eoapi-Extensions');
    extensitonConfigurations.forEach((item) => {
      const configuration = item?.contributes?.configuration;
      if (configuration) {
        configuration.title = item.moduleName ?? configuration.title;
        configuration.moduleID = item.moduleID;
        extensionsModule.contributes.configuration.push(configuration);
      }
    });
    // 给插件的属性前面追加模块ID
    const appendModuleID = (properties, moduleID) => {
      return Object.keys(properties).reduce((prev, key) => {
        prev[`${moduleID}.${key}`] = properties[key];
        return prev;
      }, {});
    };
    /** 根据configuration配置生成settings model */
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
    // 递归生成设置树
    const generateTreeData = (configurations: Configuration = []) => {
      return [].concat(configurations).reduce<TreeNode[]>((prev, curr) => {
        if (Array.isArray(curr)) {
          return prev.concat(generateTreeData(curr));
        }
        const treeItem: TreeNode = {
          name: curr.title,
          title: curr.title,
          configuration: [].concat(curr),
        };
        return prev.concat(treeItem);
      }, []);
    };
    // 所有设置项
    const treeData = allSettings.reduce<TreeNode[]>((prev, curr) => {
      let treeItem: TreeNode;
      const configuration = curr.contributes.configuration;
      if (Array.isArray(configuration)) {
        treeItem = {
          name: curr.name,
          moduleID: curr.moduleID,
          title: curr.moduleName || curr.name,
          children: generateTreeData(configuration),
          configuration,
        };
      } else {
        treeItem = {
          name: curr.name,
          moduleID: curr.moduleID,
          title: curr.moduleName || configuration.title || curr.name,
          configuration: [configuration],
        };
      }
      return prev.concat(treeItem);
    }, []);
    this.dataSource.setData(treeData);
    this.treeControl.expandAll();
    this.validateForm = this.fb.group(controls);
    this.validateForm.valueChanges.subscribe(debounce(this.handleSave.bind(this), 300));
    // 默认选中第一项
    this.selectModule(this.treeControl.dataNodes.at(0));
  }

  // private init() {
  //   if (window.eo && window.eo.getFeature) {
  //     this.isVisible = true;
  //     this.settings = window.eo.getSettings();
  //     const featureList = window.eo.getFeature('configuration');
  //     const controls = {};
  //     featureList?.forEach((feature: object, key: string) => {
  //       if (!feature['title'] || !feature['properties'] || typeof feature['properties'] !== 'object') {
  //         return true;
  //       }
  //       if (!this.settings[key] || typeof this.settings[key] !== 'object') {
  //         this.settings[key] = {};
  //       }
  //       const fields = [];
  //       for (let field_key in feature['properties']) {
  //         let field = feature['properties'][field_key];
  //         // 加入允许的type限制
  //         if (!field['type'] || !field['label']) {
  //           continue;
  //         }
  //         if ('select' === field['type'] && !field['options']) {
  //           continue;
  //         }
  //         const name = key + '_' + field_key;
  //         field = Object.assign(
  //           {
  //             name: name,
  //             key: field_key,
  //             required: false,
  //             default: '',
  //             description: '',
  //           },
  //           field
  //         );
  //         fields.push(field);
  //         if (!this.settings[key][field_key]) {
  //           this.settings[key][field_key] = field['default'];
  //         }
  //         // 可扩展加入更多默认校验
  //         if (field.required) {
  //           controls[name] = [null, [Validators.required]];
  //         } else {
  //           controls[name] = [null];
  //         }
  //       }
  //       // this.modules.push({
  //       //   key: key,
  //       //   title: feature['title'],
  //       //   fields: fields,
  //       // });
  //     });
  //     this.validateForm = this.fb.group(controls);
  //   }
  // }

  handleShowModal() {
    this.isShowModal = true;
  }

  handleSave(): void {
    // for (const i in this.validateForm.controls) {
    //   if (this.validateForm.controls.hasOwnProperty(i)) {
    //     this.validateForm.controls[i].markAsDirty();
    //     this.validateForm.controls[i].updateValueAndValidity();
    //   }
    // }
    // if (this.validateForm.status === 'INVALID') {
    //   return;
    // }
    // 加入根据返回显示提示消息
    const saved = window.eo.saveSettings({ settings: this.settings, nestedSettings: this.nestedSettings });
    if (saved) {
      // this.handleCancel();
    }
  }

  handleCancel(): void {
    this.isShowModal = false;
  }
}
