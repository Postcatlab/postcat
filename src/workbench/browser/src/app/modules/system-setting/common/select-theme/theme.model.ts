export const FEATURES_THEME = [
  {
    label: $localize`Light Default`,
    id: 'pc',
    //* relative path
    //src/extensions/core-themes/themes/light-default.json
    path: './themes/light-default.json'
  },
  {
    label: $localize`Light Blue`,
    id: 'pc-blue',
    baseTheme: 'pc',
    //* relative path
    //src/extensions/core-themes/themes/light-default.json
    path: './themes/light-blue.json'
  }
];
export const BASE_UI_THEME = [
  {
    title: $localize`Light`,
    icon: 'link-cloud-sucess',
    value: 'light'
  },
  {
    title: $localize`Dark`,
    icon: 'round',
    value: 'dark'
  }
] as const;
export type BaseUIThemeType = typeof BASE_UI_THEME[number]['value'];
