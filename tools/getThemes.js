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
var activeTab = document.querySelector(
  '#workbench\\.parts\\.editor > div.content > div.grid-view-container > div > div > div > div.monaco-scrollable-element.mac > div.split-view-container > div > div > div.title.tabs.show-file-icons > div.tabs-and-actions-container > div.monaco-scrollable-element.mac > div.tabs-container > div.tab.tab-actions-right.sizing-fit.has-icon.active'
);
var iconHover = window
  .getComputedStyle(
    document.querySelector(
      '#workbench\\.parts\\.editor > div.content > div.grid-view-container > div > div > div > div.monaco-scrollable-element.mac > div.split-view-container > div > div > div.title.tabs.show-file-icons > div.tabs-and-actions-container > div.editor-actions > div > div > ul > li:nth-child(1) > a'
    ),
    ':hover'
  )
  .getPropertyValue('background-color');
var barBackground = getDomStyle(
  '#workbench\\.parts\\.editor > div.content > div.grid-view-container > div > div > div > div.monaco-scrollable-element.mac > div.split-view-container > div > div > div.title.tabs.show-file-icons',
  'background-color'
);
var dropdownItemHoverBackground = getDomStyle('#list_id_6_0', 'background-color');
var obj = {
  icon: getVariable('--vscode-icon-foreground'),
  text: getVariable('--vscode-foreground'),
  background: document.querySelector(
    '#workbench\\.parts\\.editor > div.content > div.grid-view-container > div > div > div > div.monaco-scrollable-element.mac > div.split-view-container > div > div > div.editor-container'
  ).style['background-color'],
  primary: getVariable('--vscode-button-background'),
  info: getVariable('--vscode-editorInfo-foreground'),
  divider: getVariable('--vscode-commandCenter-border'),
  textLink: getVariable('--vscode-textLink-foreground'),
  danger: getVariable('--vscode-inputValidation-errorBorder'),
  barBackground: barBackground,
  border: 'transparent',
  inputBorder: getVariable('--vscode-commandCenter-border'),
  selectBorder: getVariable('--vscode-commandCenter-border'),
  inputPlaceholder: getVariable('--vscode-input-placeholderForeground'),
  selectItemSelectedText: getDomStyle('#list_id_6_0', 'color'),
  selectItemSelectedBackground: dropdownItemHoverBackground,
  // itemHoverBackground: iconHover,
  // itemActiveBackground: iconHover,
  layoutHeaderBackground: getDomStyle('#workbench.parts.titlebar', 'background-color'),
  layoutSidebarBackground: getDomStyle('#workbench.parts.activitybar', 'background-color'),
  layoutSidebarText: getDomStyle('#workbench\\.parts\\.activitybar > div > div:nth-child(3) > div > ul > li:nth-child(1) > a', 'color'),
  menuItemActiveText: getDomStyle(
    '#workbench\\.parts\\.activitybar > div > div.composite-bar > div > ul > li.action-item.icon.checked > a',
    'color'
  ),
  layoutFooterBackground: getDomStyle('#workbench.parts.statusbar', 'background-color'),
  layoutFooterText: getDomStyle('#workbench.parts.statusbar', 'color'),
  treeBackground: getDomStyle('#workbench.parts.sidebar', 'background-color'),
  buttonBorder: getVariable('--vscode-button-border') || 'transparent',
  buttonDefaultBorder: getVariable('--vscode-button-border') || 'transparent',
  buttonDefaultHoverBackground: getVariable('--vscode-button-hoverBackground'),
  buttonDefaultHoverText: getVariable('--vscode-button-foreground'),
  tabsActive: getComputedStyle(
    document.querySelector(
      '#workbench\\.parts\\.activitybar > div > div.composite-bar > div > ul > li.action-item.icon.checked > div.active-item-indicator'
    )
  ).getPropertyValue('--insert-border-color'),
  tabsCardItemActiveText: activeTab.style['color'],
  tabsCardItemBackground: barBackground,
  tabsCardItemActiveBackground: activeTab.style['background-color'],
  tabsCardItemActive: 'transparent',
  activeBorder: getVariable('--vscode-focusBorder'),
  radioBorder: getVariable('--vscode-focusBorder'),
  radioCheckedBackground: getVariable('--vscode-focusBorder'),
  checkboxCheckedBackground: getVariable('--vscode-settings-checkboxBackground'),
  collapseBorder: getVariable('--vscode-commandCenter-border'),
  collapseHeaderBackground: getVariable('--vscode-keybindingTable-headerBackground'),
  tableBorder: getVariable('--vscode-commandCenter-border'),
  tableHeaderBackground: getVariable('--vscode-keybindingTable-headerBackground'),
  tableHeaderText: getDomStyle('.monaco-workbench', 'color'),
  // modalHeaderBackground: getVariable('--vscode-keybindingTable-headerBackground'),
  scrollbarThumbBackground: getVariable('--vscode-scrollbarSlider-background'),
  dropdownBackground: getVariable('--vscode-dropdown-background'),
  dropdownItemHoverBackground: dropdownItemHoverBackground
};
console.log(
  JSON.stringify({
    colors: obj
  })
);
