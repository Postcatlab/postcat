import { Component, OnInit } from '@angular/core';
import { NzTabPosition } from 'ng-zorro-antd/tabs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { eoapiSettings } from './eoapi-settings/';
import extensionsSettings from './extensions-setting.json';

interface TreeNode {
  name: string;
  title: string;
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
  isModal = false;
  position: NzTabPosition = 'left';
  /** 所有模块 */
  modules = [];
  /** 所有配置 */
  settings = {};
  validateForm!: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // this.init();
    this.isVisible = true;
    this.parseSettings();
    console.log('setings', this.settings);
  }

  hasChild = (_: number, node: FlatNode): boolean => node.expandable;

  /**
   * 设置数据
   * @param properties
   */
  private setSettingsModel(properties, controls) {
    // Object.keys(properties).forEach((key) => {
    //   const keyArr = key.split('.');
    //   const keyArrL = keyArr.length - 1;
    //   keyArr.reduce((p, k, i) => {
    //     const isLast = i === keyArrL;
    //     p[k] ??= isLast ? properties[key].default : {};
    //     return p[k];
    //   }, this.settings);
    // });
    Object.keys(properties).forEach((fieldKey) => {
      const props = properties[fieldKey];
      this.settings[fieldKey] = props.default;
      // 可扩展加入更多默认校验
      if (props.required) {
        controls[fieldKey] = [null, [Validators.required]];
      } else {
        controls[fieldKey] = [null];
      }
    });
  }

  /**
   * 根据key路径获取对应的配置的值
   * @param key
   * @returns
   */
  getConfiguration(key: string) {
    return key.split('.').reduce((p, k) => p[k], this.settings);
  }
  /**
   * 获取模块的标题
   * @param module
   * @returns
   */
  getModuleTitle(module: any): string {
    const title = module?.contributes?.title ?? module?.title;
    return title;
  }

  selectModule(node) {
    console.log('selectModule', node);
    this.currentConfiguration = node.configuration || [];
    console.log('this.currentConfiguration', this.currentConfiguration);
    this.selectListSelection.toggle(node);
  }

  /**
   * 解析所有模块的配置信息
   */
  private parseSettings() {
    const controls = {};
    // 所有设置
    const allSettings = [
      eoapiSettings['Eoapi-Common'],
      eoapiSettings['Eoapi-Extensions'],
      eoapiSettings['Eoapi-Features'],
    ];
    // 所有配置
    const allConfiguration = allSettings.map((n) => n.contributes.configuration);
    // 第三方扩展
    extensionsSettings.extensions.forEach((item) => {
      eoapiSettings['Eoapi-Extensions'].contributes.configuration.push(item);
    });
    /** 根据configuration配置生成settings model */
    allConfiguration.forEach((item) => {
      if (Array.isArray(item)) {
        item.forEach((n) => this.setSettingsModel(n.properties, controls));
      } else {
        const properties = item.properties;
        this.setSettingsModel(properties, controls);
      }
    });

    const generateTreeData = (
      configurations: typeof allConfiguration[number] | Array<typeof allConfiguration[number]> = allConfiguration
    ) => {
      return (Array.isArray(configurations) ? configurations : [configurations]).reduce<TreeNode[]>((prev, curr) => {
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
    const treeData = allSettings.reduce<TreeNode[]>((prev, curr) => {
      let treeItem: TreeNode;
      const configuration = curr.contributes.configuration;
      if (Array.isArray(configuration)) {
        treeItem = {
          name: curr.name,
          title: curr.displayName || curr.name,
          children: generateTreeData(configuration),
          configuration,
        };
      } else {
        treeItem = {
          name: curr.name,
          title: curr.displayName || configuration.title || curr.name,
          configuration: [configuration],
        };
      }
      return prev.concat(treeItem);
    }, []);
    console.log('treeData', treeData);
    this.modules = allSettings;
    this.dataSource.setData(treeData);
    this.treeControl.expandAll();
    this.validateForm = this.fb.group(controls);
  }

  private init() {
    if (window.eo && window.eo.getFeature) {
      this.isVisible = true;
      this.settings = window.eo.getSettings();
      const featureList = window.eo.getFeature('configuration');
      const controls = {};
      featureList?.forEach((feature: object, key: string) => {
        if (!feature['title'] || !feature['properties'] || typeof feature['properties'] !== 'object') {
          return true;
        }
        if (!this.settings[key] || typeof this.settings[key] !== 'object') {
          this.settings[key] = {};
        }
        const fields = [];
        for (let field_key in feature['properties']) {
          let field = feature['properties'][field_key];
          // 加入允许的type限制
          if (!field['type'] || !field['label']) {
            continue;
          }
          if ('select' === field['type'] && !field['options']) {
            continue;
          }
          const name = key + '_' + field_key;
          field = Object.assign(
            {
              name: name,
              key: field_key,
              required: false,
              default: '',
              description: '',
            },
            field
          );
          fields.push(field);
          if (!this.settings[key][field_key]) {
            this.settings[key][field_key] = field['default'];
          }
          // 可扩展加入更多默认校验
          if (field.required) {
            controls[name] = [null, [Validators.required]];
          } else {
            controls[name] = [null];
          }
        }
        this.modules.push({
          key: key,
          title: feature['title'],
          fields: fields,
        });
      });
      this.validateForm = this.fb.group(controls);
    }
  }

  handleShowModal() {
    this.isModal = true;
  }

  handleSave(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.validateForm.status === 'INVALID') {
      return;
    }
    // 加入根据返回显示提示消息
    const saved = window.eo.saveSettings(this.settings);
    if (saved) {
      this.handleCancel();
    }
  }

  handleCancel(): void {
    this.isModal = false;
  }
}
