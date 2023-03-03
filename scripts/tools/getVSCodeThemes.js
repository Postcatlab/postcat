var dom = getComputedStyle(document.getElementsByClassName('monaco-workbench')[0]);
var getProperty = name => {
  return dom.getPropertyValue(name.replace('var(', '').replace(')', ''));
};
var getVariable = name => {
  return dom.getPropertyValue(name).trim();
};
var getDomStyle = (selector, attr) => {
  let dom;
  const start = selector[0];
  if (start === '#' && !selector.includes('\\')) {
    dom = document.getElementById(selector.slice(1));
  } else if (start === '.') {
    dom = document.getElementsByClassName(selector.slice(1))[0];
  } else {
    dom = document.querySelector(selector);
  }
  if (!dom) {
    console.error(selector, attr, dom);
  }
  const cssVal = dom.style[attr];
  if (!cssVal) {
    return getComputedStyle(dom)[attr];
  }
  if (cssVal.includes('var(')) {
    return getProperty(cssVal);
  }
  return cssVal;
};
var barBackground = getDomStyle(
  '#workbench\\.parts\\.editor > div.content > div.grid-view-container > div > div > div > div.monaco-scrollable-element.mac > div.split-view-container > div > div > div.title.tabs.show-file-icons',
  'background-color'
);
var obj = {
  icon: getVariable('--vscode-icon-foreground'),
  text: getVariable('--vscode-foreground'),
  background: getVariable('--vscode-editor-background'),
  primary: getVariable('--vscode-button-background'),
  info: getVariable('--vscode-editorInfo-foreground'),
  divider: getVariable('--vscode-commandCenter-border'),
  textLink: getVariable('--vscode-textLink-foreground'),
  danger: getVariable('--vscode-inputValidation-errorBorder'),
  barBackground: getVariable('--vscode-editorGroupHeader-tabsBackground'),
  border: document.getElementById('workbench.parts.titlebar').style['border-bottom']
    ? getDomStyle('#workbench.parts.titlebar', 'border-bottom-color')
    : 'transparent',
  tabsBadge: getVariable('--vscode-tab-inactiveForeground'),
  tabsActiveBadge: getVariable('--vscode-tab-activeForeground'),
  inputIcon: getVariable('--vscode-input-foreground'),
  inputBorder: getVariable('--vscode-commandCenter-border'),
  selectBorder: getVariable('--vscode-commandCenter-border'),
  inputPlaceholder: getVariable('--vscode-input-placeholderForeground'),
  selectItemSelectedText: getVariable('--vscode-menu-selectionForeground'),
  selectItemSelectedBackground: getVariable('--vscode-menu-selectionBackground'),
  layoutHeaderBackground: getDomStyle('#workbench.parts.titlebar', 'background-color'),
  layoutSidebarBackground: getDomStyle('#workbench.parts.activitybar', 'background-color'),
  layoutSidebarText: getVariable('--vscode-activityBar-inactiveForeground'),
  menuItemActiveText: getVariable('--vscode-activityBar-foreground'),
  layoutFooterBackground: getDomStyle('#workbench.parts.statusbar', 'background-color'),
  layoutFooterText: getDomStyle('#workbench.parts.statusbar', 'color'),
  treeBackground: getDomStyle('#workbench.parts.sidebar', 'background-color'),
  buttonPrimaryText: getVariable('--vscode-button-foreground'),
  buttonBorder: getVariable('--vscode-button-border') || 'transparent',
  buttonDefaultBorder: getVariable('--vscode-button-border') || getVariable('--vscode-commandCenter-border') || 'transparent',
  buttonDefaultHoverBackground: getVariable('--vscode-button-hoverBackground'),
  buttonDefaultHoverText: getVariable('--vscode-button-foreground'),
  tabsCardText: getVariable('--vscode-tab-inactiveForeground'),
  tabsCardItemActiveText: getVariable('--vscode-tab-activeForeground'),
  tabsCardItemBackground: getVariable('--vscode-tab-inactiveBackground'),
  tabsCardItemActiveBackground: getVariable('--vscode-tab-activeBackground'),
  tabsCardItemActive: 'transparent',
  activeBorder: getVariable('--vscode-focusBorder'),
  radioBorder: getVariable('--vscode-focusBorder'),
  radioCheckedBackground: getVariable('--vscode-focusBorder'),
  checkboxInner: getVariable('--vscode-settings-checkboxForeground') || getVariable('--vscode-foreground'),
  checkboxBorder: getVariable('--vscode-settings-checkboxBorder'),
  checkboxCheckedBackground: getVariable('--vscode-settings-checkboxBackground'),
  checkboxCheckedBorder: getVariable('--vscode-settings-checkboxBorder'),
  collapseBorder: getVariable('--vscode-commandCenter-border'),
  collapseHeaderBackground: getVariable('--vscode-keybindingTable-headerBackground'),
  tableBorder: getVariable('--vscode-commandCenter-border'),
  tableHeaderBackground: getVariable('--vscode-keybindingTable-headerBackground'),
  tableHeaderText: getDomStyle('.monaco-workbench', 'color'),
  scrollbarThumbBackground: getVariable('--vscode-scrollbarSlider-background'),
  dropdownBackground: getVariable('--vscode-dropdown-background'),
  dropdownItemHoverBackground: getVariable('--vscode-menu-selectionBackground'),
  dropdownItemHoverText: getVariable('--vscode-list-activeSelectionForeground')
};
console.log(
  JSON.stringify({
    colors: obj
  })
);
