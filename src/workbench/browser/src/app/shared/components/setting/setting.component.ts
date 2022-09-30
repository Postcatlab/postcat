import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/remote/remote.service';
import { SettingService } from 'eo/workbench/browser/src/app/core/services/settings/settings.service';
import { debounce } from 'eo/workbench/browser/src/app/utils/index.utils';

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
  extensitonConfigurations: any[];
  objectKeys = Object.keys;
  isClick = false;
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
  treeNodes = [
    {
      name: $localize`:@@Account:Account`,
      moduleID: 'eoapi-account',
      children: [
        {
          name: $localize`:@@Account:Username`,
          moduleID: 'eoapi-account-username',
        },
        {
          name: $localize`:@@Account:Password`,
          moduleID: 'eoapi-account-password',
        },
      ],
    },
    {
      name: $localize`:@@DataSource:Data Storage`,
      moduleID: 'eoapi-common',
    },
    {
      name: $localize`:@@Language:Language`,
      moduleID: 'eoapi-language',
    },
    {
      name: $localize`About`,
      moduleID: 'eoapi-about',
    },
  ] as const;
  /** local configure */
  localSettings = {};
  validateForm!: FormGroup;
  /** cloud server url */
  remoteServerUrl = '';
  get selected() {
    return this.selectListSelection.selected.at(0)?.moduleID;
  }

  constructor(private remoteService: RemoteService, private settingService: SettingService) {}

  ngOnInit(): void {
    this.init();
    this.remoteServerUrl = this.settings['eoapi-common.remoteServer.url'];
    // this.parseSettings();
  }

  hasChild = (_: number, node: FlatNode): boolean => node.expandable;

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

  handleScroll = debounce((e: Event) => {
    if (this.isClick) {
      return;
    }
    const target = e.target as HTMLDivElement;
    const treeNodes = this.dataSource._flattenedData.value;
    treeNodes.some((node) => {
      const el = target.querySelector(`#${node.moduleID}`) as HTMLDivElement;
      if (el.offsetTop > target.scrollTop) {
        this.selectListSelection.select(node);
        return true;
      }
    });
  }, 50);

  selectModule(node) {
    this.isClick = true;
    this.currentConfiguration = node.configuration || [];
    // console.log('this.currentConfiguration', this.currentConfiguration);
    this.selectListSelection.select(node);
    const target = document.querySelector(`#${node.moduleID}`);
    console.log('target', target, node.moduleID);
    target?.scrollIntoView();
    setTimeout(() => {
      this.isClick = false;
    }, 800);
  }

  /**
   * Parse the configuration information of all modules
   */
  private init() {
    this.settings = this.localSettings = this.settingService.getSettings();
    const modules = window.eo?.getModules() || new Map([]);
    this.extensitonConfigurations = [...modules.values()]
      .filter((n) => n.features?.configuration)
      .map((n) => {
        const configuration = n.features.configuration;
        if (Array.isArray(configuration)) {
          configuration.forEach((m) => (m.moduleID ??= n.moduleID));
        } else {
          configuration.moduleID ??= n.moduleID;
        }
        return configuration;
      });

    // Recursively generate the setup tree
    const generateTreeData = (configurations = []) =>
      [].concat(configurations).reduce<TreeNode[]>((prev, curr) => {
        if (Array.isArray(curr)) {
          return prev.concat(generateTreeData(curr));
        }
        const treeItem: TreeNode = {
          name: curr.title,
          moduleID: curr.moduleID,
          configuration: [].concat(curr),
        };
        return prev.concat(treeItem);
      }, []);
    // All settings
    const treeData = JSON.parse(JSON.stringify(this.treeNodes));
    // const extensions = treeData.find((n) => n.moduleID === 'eoapi-extensions');
    // extensions.children = generateTreeData(this.extensitonConfigurations);
    // extensions.configuration = this.extensitonConfigurations;
    this.dataSource.setData(treeData);
    this.treeControl.expandAll();

    // The first item is selected by default
    this.selectModule(this.treeControl.dataNodes.at(0));
  }

  handleSave = () => {
    this.settingService.saveSetting(this.settings);
    window.eo?.saveSettings?.({ ...this.settings });
  };
}
