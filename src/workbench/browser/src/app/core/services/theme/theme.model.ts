export type ThemeColors = {
  text: string;
  textSecondary: string;

  border: string;
  hoverBorder?: string;
  activeBorder?: string;

  shadow: string;
  background: string;
  barBackground: string;
  divider?: string;

  primary: string;
  primaryHover?: string;
  success: string;
  successHover?: string;
  successShadow?: string;
  warning: string;
  warningHover?: string;
  warningShadow?: string;
  danger: string;
  dangerHover?: string;
  dangerShadow?: string;
  info: string;
  infoHover?: string;
  infoShadow?: string;

  itemActiveBackground: string;
  itemHoverBackground: string;

  textLink: string;
  textLinkHover?: string;
  textLinkActive?: string;

  disabledText?: string;
  disabledBackground: string;
  disabledBorder?: string;

  scrollbarTrackBackground?: string;
  scrollbarThumbBackground?: string;

  layoutHeaderText?: string;
  layoutHeaderBackground?: string;
  layoutSidebarText?: string;
  layoutSidebarBackground?: string;

  layoutFooterText?: string;
  layoutFooterBackground?: string;
  layoutFooterItemHoverBackground?: string;

  icon?: string;
  iconText?: string;

  buttonBorder?: string;
  buttonShadow?: string;
  buttonTextText?: string;
  buttonTextHoverText?: string;
  buttonTextHoverBackground?: string;
  buttonPrimaryText?: string;
  buttonPrimaryBorder?: string;
  buttonPrimaryBackground?: string;
  buttonPrimaryHoverBorder?: string;
  buttonPrimaryHoverBackground?: string;
  buttonPrimaryActiveBorder?: string;
  buttonPrimaryActiveBackground?: string;
  buttonPrimaryShadow?: string;
  buttonDefaultText?: string;
  buttonDefaultBorder?: string;
  buttonDefaultBackground?: string;
  buttonDefaultHoverText?: string;
  buttonDefaultHoverBorder?: string;
  buttonDefaultHoverBackground?: string;
  buttonDefaultActiveBorder?: string;
  buttonDefaultActiveBackground?: string;
  buttonDefaultShadow?: string;
  buttonDangerText?: string;
  buttonDangerBorder?: string;
  buttonDangerBackground?: string;
  buttonDangerHoverText?: string;
  buttonDangerHoverBorder?: string;
  buttonDangerHoverBackground?: string;
  buttonDangerActiveBorder?: string;
  buttonDangerActiveBackground?: string;
  buttonDangerShadow?: string;

  tabsBadge?: string;
  tabsActiveBadge?: string;
  tabsBackground?: string;
  tabsText?: string;
  tabsActive?: string;
  tabsActiveText?: string;

  tabsCardText?: string;
  tabsCardBackground?: string;
  tabsCardItemBackground?: string;
  tabsCardItemActive?: string;
  tabsCardItemActiveText?: string;
  tabsCardItemActiveBackground?: string;

  tableText?: string;
  tableBorder?: string;
  tableBackground?: string;
  tableHeaderText?: string;
  tableHeaderBackground?: string;
  tableRowHoverBackground?: string;
  tableFooterBackground?: string;
  tableFooterText?: string;

  treeHeaderBackground?: string;
  treeText?: string;
  treeBackground?: string;
  treeSelectedText?: string;
  treeSelectedBackground?: string;
  treeHoverText?: string;
  treeHoverBackground?: string;

  dropdownMenuBackground?: string;
  dropdownItemText?: string;
  dropdownItemHoverText?: string;
  dropdownItemHoverBackground?: string;

  menuBackground?: string;
  menuItemText?: string;
  menuItemGroupTitleText?: string;
  menuItemActiveBackground?: string;
  menuItemActive?: string;
  menuItemActiveText?: string;
  menuInlineSubmenuBackground?: string;

  selectText?: string;
  selectBorder?: string;
  selectHoverBorder?: string;
  selectActiveBorder?: string;
  selectBackground?: string;
  selectDropdownText?: string;
  selectDropdownBackground?: string;
  selectItemSelectedText?: string;
  selectItemSelectedBackground?: string;

  inputText?: string;
  inputBackground?: string;
  inputIcon?: string;
  inputBorder?: string;
  inputHoverBorder?: string;
  inputActiveBorder?: string;
  inputPlaceholder?: string;

  modalHeaderBackground?: string;
  modalHeaderText?: string;
  modalBodyBackground?: string;
  modalBodyText?: string;
  modalFooterBackground?: string;
  modalFooterText?: string;
  modalMaskBackground?: string;

  paginationItemBackground?: string;
  paginationItemActiveBackground?: string;
  paginationButtonBackground?: string;

  toastSuccessText?: string;
  toastSuccessIcon?: string;
  toastSuccessBackground?: string;
  toastWarningIcon?: string;
  toastWarningText?: string;
  toastWarningBackground?: string;
  toastInfoText?: string;
  toastInfoIcon?: string;
  toastInfoBackground?: string;
  toastErrorText?: string;
  toastErrorIcon?: string;
  toastErrorBackground?: string;

  alertDefaultText?: string;
  alertDefaultIcon?: string;
  alertDefaultBackground: string;
  alertSuccessText?: string;
  alertSuccessIcon?: string;
  alertSuccessBackground?: string;
  alertInfoText?: string;
  alertInfoIcon?: string;
  alertInfoBackground?: string;
  alertErrorText?: string;
  alertErrorIcon?: string;
  alertErrorBackground?: string;
  alertWarningText?: string;
  alertWarningIcon?: string;
  alertWarningBackground?: string;

  checkboxText?: string;
  checkboxBorder?: string;
  checkboxBackground?: string;
  checkboxCheckedBackground?: string;
  checkboxInner?: string;
  checkboxCheckedBorder?: string;
  checkboxCheckedText?: string;

  radioText?: string;
  radioBorder?: string;
  radioBackground?: string;
  radioCheckedText?: string;
  radioCheckedBorder?: string;
  radioCheckedBackground?: string;

  switchActive?: string;
  switchBakcground?: string;
  switchText?: string;

  switchCardBorder?: string;
  switchCardBackground?: string;
  switchCardText?: string;

  collapseHeaderBackground?: string;
  collapseBorder?: string;
  collapseContentBackground?: string;

  popoverBackground?: string;
  popoverText?: string;

  progressDefault?: string;
  progressSuccess?: string;
  progressException?: string;

  spin?: string;
};

export type ThemeColorRule = {
  source?: keyof ThemeColors | string;
  target?: string;
  default?: string;
  rule?: ThemeColorSingleRule[];
};
export type ThemeColorSingleRule = {
  action?: 'replace' | 'filter' | 'darken' | string;
  alpha?: number;
  target?: Array<keyof ThemeColors> | string[];
};
