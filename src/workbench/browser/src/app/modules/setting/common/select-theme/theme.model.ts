export const THEMES = [
  {
    title: $localize`Default`,
    value: 'default',
    navBackgroud: '#f8f8fa',
    sidebarBackground: '#ffffff',
    contentBackground: '#ffffff',
    primaryColor: '#00785a'
  },
  {
    title: $localize`Orange`,
    value: 'orange',
    navBackgroud: '#f8f8fa',
    sidebarBackground: '#ffffff',
    contentBackground: '#ffffff',
    primaryColor: '#f47023'
  },
  {
    title: $localize`Blue`,
    navBackgroud: '#f8f8fa',
    sidebarBackground: '#ffffff',
    contentBackground: '#ffffff',
    value: 'blue',
    primaryColor: '#2878ff'
  },
  {
    title: $localize`Purple`,
    navBackgroud: '#f8f8fa',
    sidebarBackground: '#ffffff',
    contentBackground: '#ffffff',
    value: 'purple',
    primaryColor: '#673ab7'
  }
] as const;
export type MainColorType = typeof THEMES[number]['value'];

export const APPEARANCE = [
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
export type AppearanceType = typeof APPEARANCE[number]['value'];
