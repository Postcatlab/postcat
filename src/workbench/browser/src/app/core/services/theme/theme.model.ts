export type ThemeItems = {
  label: string;
  id: string;
  baseTheme: string;
  colors: ThemeColors;
};
export type ThemeColors = {
  text: string;
  textSecondary: string;
  border: string;
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
  layoutSiderText?: string;
  layoutSiderBackground?: string;
  layoutFooterText?: string;
  layoutFooterBackground?: string;

  iconText?: string;

  buttonBorder?: string;
  buttonShadow?: string;
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

  tabsText?: string;
  tabsActive?: string;
  tabsActiveText?: string;

  tabsCardBarBackground?: string;
  tabsCardText?: string;
  tabsCardBackground?: string;
  tabsCardActive?: string;
  tabsCardActiveText?: string;
  tabsCardActiveBackground?: string;

  tableText?: string;
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
  modalContentBackground?: string;
  modalContentText?: string;
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
  collapseContentbackground?: string;

  popoverBackground?: string;
  popoverText?: string;

  progressDefault?: string;
  progressSuccess?: string;
  progressException?: string;
};
export type ThemeColorRule = {
  action: 'replace' | 'filter';
  alpha?: number;
  source?: keyof ThemeColors;
  target: Array<keyof ThemeColors> | string[];
};
