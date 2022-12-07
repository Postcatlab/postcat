export const THEMES = [
  {
    value: 'default',
    color: '#00785a',
  },
  {
    value: 'orange',
    color: '#f47023',
  },
  {
    value: 'blue',
    color: '#2878ff',
  },
  {
    value: 'purple',
    color: '#673ab7',
  },
] as const;
export type MainColorType = typeof THEMES[number]['value'];

export const APPEARANCE = [
  {
    title:$localize`Light`,
    icon: 'link-cloud-sucess',
    value: 'light',
  },
  {
    title: $localize`Dark`,
    icon: 'round',
    value: 'dark',
  }
] as const;
export type AppearanceType = typeof APPEARANCE[number]['value'];

