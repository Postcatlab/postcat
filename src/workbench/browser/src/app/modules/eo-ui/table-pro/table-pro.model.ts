export interface TableProSetting {
  isEdit?: boolean;
  isLevel?: boolean;
  primaryKey?: string;
  rowSortable?: boolean;
  /**
   * Manually add row
   */
  manualAdd?: boolean;
  toolButton?: {
    columnVisible?: boolean;
    fullScreen?: boolean;
  };
}
