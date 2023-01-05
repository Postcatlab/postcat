import lightDefault from '../../../../extensions/core-themes/themes/light-default.json';
export const SYSTEM_THEME: Array<{
  label: string;
  id: string;
  baseTheme?: string;
  customColors: Partial<ThemeColors>;
  core?: boolean;
  colors?: ThemeColors;
  path?: string;
}> = [
  {
    label: $localize`Light Default`,
    id: 'pc',
    baseTheme: '',
    core: true,
    customColors: lightDefault.colors
  },
  {
    label: $localize`Light Blue`,
    id: 'pc-blue',
    baseTheme: 'pc',
    customColors: {},
    //* relative path
    //src/extensions/core-themes/themes/light-blue.json
    path: './themes/light-blue.json'
  }
];
export type SsystemUIThemeType = typeof SYSTEM_THEME[number]['id'];
export type ThemeItems = {
  title: string;
  id: string;
  baseTheme: string;
  previewColors: Partial<ThemeColors>;
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
  //Scroller-bar
  scrollbarTrackBackground?: string;
  scrollbarThumbBackground?: string;
  //Layout-Header
  layoutHeaderBackground?: string;
  layoutSiderText?: string;
  layoutSiderBackground?: string;
  layoutSiderActiveText?: string;
  layoutSiderActive?: string;
  layoutFooterText?: string;
  layoutFooterBackground?: string;
  //Icon
  iconText?: string;
  //Button
  buttonShadow?: string;
  buttonPrimaryText?: string;
  buttonPrimaryBackground?: string;
  buttonPrimaryShadow?: string;
  buttonDefaultText?: string;
  buttonDefaultBackground?: string;
  buttonDefaultShadow?: string;
  buttonDangerText?: string;
  buttonDangerBackground?: string;
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
  tabsCardActive?: string;
  tabsCardActiveText?: string;
  tabsCardActiveBackground?: string;
  //Table
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
  //Select
  selectBorder?: string;
  selectBackground?: string;
  selectDropdownBackground?: string;
  selectItemSelectedText?: string;
  selectItemSelectedBackground?: string;
  //Input
  inputText?: string;
  inputBackground?: string;
  inputIcon?: string;
  inputBorder?: string;
  inputPlaceholder?: string;
  //Modal
  modalHeaderBackground?: string;
  modalHeaderText?: string;
  modalContentBackground?: string;
  modalFooterBackground?: string;
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
};
export type ThemeColorRule = {
  action: 'replace' | 'filter';
  alpha?: number;
  targets: string[];
};
