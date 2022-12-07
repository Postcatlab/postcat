import { InjectionToken } from '@angular/core';

export interface TableProConfig {
  childKey: string;
  fullScreenIcon: string;
  fullScreenTitle: string;
  columnVisibleTitle: string;
  columnVisibleIcon: string;
}
export const TABLE_PRO_DEFUALT_CONFIG: TableProConfig = {
  childKey: 'children',
  fullScreenIcon: 'full-screen',
  fullScreenTitle: $localize`Full Screen`,
  columnVisibleTitle: $localize`Column Visible`,
  columnVisibleIcon: 'view-list-781pg17c',
};
export const TABLE_PRO_CONFIG = new InjectionToken<TableProConfig>('table-pro-config', {
  providedIn: 'root',
  factory: () => TABLE_PRO_DEFUALT_CONFIG,
});
