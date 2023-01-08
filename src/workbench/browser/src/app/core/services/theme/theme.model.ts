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
  //Link
  textLink: string;
  textLinkHover?: string;
  textLinkActive?: string;
  //Disabled
  disabledText?: string;
  disabledBackground: string;
  disabledBorder?: string;
  //Scroller-bar
  scrollbarTrackBackground?: string;
  scrollbarThumbBackground?: string;
  //Layout-Header
  layoutHeaderBackground?: string;
  layoutSiderText?: string;
  layoutSiderBackground?: string;
  layoutFooterText?: string;
  layoutFooterBackground?: string;
  //Icon
  iconText?: string;
  //Button
  buttonBorder?: string;
  buttonShadow?: string;
  buttonPrimaryText?: string;
  buttonPrimaryBorder?: string;
  buttonPrimaryHoverBorder?: string;
  buttonPrimaryActiveBorder?: string;
  buttonPrimaryBackground?: string;
  buttonPrimaryHoverBackground?: string;
  buttonPrimaryActiveBackground?: string;
  buttonPrimaryShadow?: string;
  buttonDefaultText?: string;
  buttonDefaultBorder?: string;
  buttonDefaultHoverBorder?: string;
  buttonDefaultActiveBorder?: string;
  buttonDefaultBackground?: string;
  buttonDefaultHoverBackground?: string;
  buttonDefaultActiveBackground?: string;
  buttonDefaultShadow?: string;
  buttonDangerText?: string;
  buttonDangerHoverText?: string;
  buttonDangerBorder?: string;
  buttonDangerHoverBorder?: string;
  buttonDangerActiveBorder?: string;
  buttonDangerBackground?: string;
  buttonDangerHoverBackground?: string;
  buttonDangerActiveBackground?: string;
  buttonDangerShadow?: string;
  //Divider
  divider?: string;
  //Tabs
  tabsText?: string;
  tabsActive?: string;
  tabsActiveText?: string;
  //Cards Tabs
  tabsCardBarBackground?: string;
  tabsCardText?: string;
  tabsCardBackground?: string;
  tabsCardActiveText?: string;
  tabsCardActiveBackground?: string;
  //Table
  tableText?: string;
  tableBackground?: string;
  tableHeaderText?: string;
  tableHeaderBackground?: string;
  tableRowHoverBackground?: string;
  tableFooterBackground?: string;
  tableFooterText?: string;
  //Tree
  treeHeaderBackground?: string;
  treeText?: string;
  treeBackground?: string;
  treeSelectedText?: string;
  treeSelectedBackground?: string;
  treeHoverText?: string;
  treeHoverBackground?: string;
  //Dropdow
  dropdownMenuBackground?: string;
  dropdownItemHoverBackground?: string;
  //Menu
  menuBackground?: string;
  menuItemText?: string;
  menuItemGroupTitleText?: string;
  menuItemActiveBackground?: string;
  menuItemActive?: string;
  menuItemActiveText?: string;
  menuInlineSubmenuBackground?: string;
  //Select
  selectText?: string;
  selectBorder?: string;
  selectHoverBorder?: string;
  selectActiveBorder?: string;
  selectBackground?: string;
  selectDropdownText?: string;
  selectDropdownBackground?: string;
  selectItemSelectedText?: string;
  selectItemSelectedBackground?: string;
  //Input
  inputText?: string;
  inputBackground?: string;
  inputIcon?: string;
  inputBorder?: string;
  inputHoverBorder?: string;
  inputActiveBorder?: string;
  inputPlaceholder?: string;
  //Modal
  modalHeaderBackground?: string;
  modalHeaderText?: string;
  modalContentBackground?: string;
  modalContentText?: string;
  modalFooterBackground?: string;
  modalFooterText?: string;
  modalMaskBackground?: string;
  //Pagination
  paginationItemBackground?: string;
  paginationItemActiveBackground?: string;
  //Next page/Pre page
  paginationButtonBackground?: string;
  //Toast message
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
  //Alert
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
  //Checkbox
  checkboxText?: string;
  checkboxBorder?: string;
  checkboxBackground?: string;
  checkboxCheckedBackground?: string;
  checkboxCheckedBorder?: string;
  checkboxCheckedText?: string;
  //Radio
  radioText?: string;
  radioBorder?: string;
  radioBackground?: string;
  radioCheckedBackground?: string;
  radioCheckedBorder?: string;
  radioCheckedText?: string;
  //Switch
  switchActive?: string;
  switchBakcground?: string;
  switchText?: string;
  //Switch Card
  switchCardBorder?: string;
  switchCardBackground?: string;
  switchCardText?: string;
  //Collapse
  collapseHeaderBackground?: string;
  collapseContentbackground?: string;
  //Popover background
  popoverBackground?: string;
  popoverText?: string;
  //Progress
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
