export interface TableProSetting {
  isEdit?: boolean;
  isLevel?: boolean;
  primaryKey?: string;
  rowSortable?: boolean;
  id?: string;
  /**
   * Manually add row
   */
  manualAdd?: boolean;
  toolButton?: {
    columnVisible?: boolean;
    fullScreen?: boolean;
  };
}
