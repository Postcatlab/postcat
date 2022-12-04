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
    icon: 'link-cloud-sucess',
    value: 'dark',
  },
  {
    icon: 'loading',
    value: 'light',
  },
] as const;
export type AppearanceType = typeof APPEARANCE[number]['value'];

