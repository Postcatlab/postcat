export type TOCEntry<T> = {
  id: string;
  label: string;
  order?: number;
  children?: TOCEntry<T>[];
  settings?: Array<T>;
};

export const tocData: TOCEntry<string>[] = [
  {
    id: 'common',
    label: '通用',
    settings: ['common.*'],
  },
  {
    id: 'extension',
    label: '插件',
    settings: ['extension.*'],
  },
];
