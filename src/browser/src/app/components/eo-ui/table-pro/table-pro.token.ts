import { InjectionToken } from '@angular/core';

export interface TableProConfig {
  childKey: string;
  fullScreenIcon: string;
  fullScreenTitle: string;
  columnVisibleTitle: string;
  columnVisibleIcon: string;
  btnAddRowIcon: string;
  btnAddRowTitle: string;
  btnAddChildRowIcon: string;
  btnAddChildRowTitle: string;
  btnInsertRowIcon: string;
  btnInsertRowTitle: string;
  btnEditRowIcon: string;
  btnEditRowTitle: string;
  btnDeleteRowIcon: string;
  btnDeleteRowTitle: string;
  btnDeleteRowConfirmTitle: string;
}
export const TABLE_PRO_DEFUALT_CONFIG: TableProConfig = {
  childKey: 'childList',
  fullScreenIcon: 'full-screen',
  fullScreenTitle: $localize`Full Screen`,
  columnVisibleTitle: $localize`Column Visible`,
  columnVisibleIcon: 'view-list',
  btnAddRowIcon: 'add',
  btnAddRowTitle: $localize`Add Row`,
  btnAddChildRowIcon: 'add',
  btnAddChildRowTitle: $localize`Add Child Row`,
  btnInsertRowIcon: 'down-small',
  btnInsertRowTitle: $localize`Add Row Down`,
  btnEditRowIcon: 'edit',
  btnEditRowTitle: $localize`Edit`,
  btnDeleteRowIcon: 'delete',
  btnDeleteRowTitle: $localize`Delete`,
  btnDeleteRowConfirmTitle: $localize`Are you sure you want to delete?`
};
export const TABLE_PRO_CONFIG = new InjectionToken<TableProConfig>('table-pro-config', {
  providedIn: 'root',
  factory: () => TABLE_PRO_DEFUALT_CONFIG
});
