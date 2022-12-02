export const THEMES = [
  {
    title: 'default',
    value: '#00785a',
  },
  {
    title: 'orange',
    value: '#f47023',
  },
  {
    title: 'blue',
    value: '#2878ff',
  },
  {
    title: 'purple',
    value: '#673ab7',
  },
] as const;
export type MainColor = typeof THEMES[number]['title'];
