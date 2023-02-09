import { ExtensionInfo } from 'eo/workbench/browser/src/app/shared/models/extension-manager';

export enum ExtensionGroupType {
  all = 'all',
  official = 'official',
  installed = 'installed'
}

export interface EoExtensionInfo extends ExtensionInfo {
  installed?: boolean;
  changeLog?: string;
  bugs: {
    url: string;
  };
  [key: string]: any;
}

export enum ContributionPointsPrefix {
  category = '@category:',
  feature = '@feature:'
}

export const featuresTipsMap = {
  importAPI: {
    type: 'format',
    suggest: '@feature:importAPI'
  },
  exportAPI: {
    type: 'format',
    suggest: '@feature:exportAPI'
  },
  syncAPI: {
    type: 'format',
    suggest: '@feature:syncAPI'
  },
  sidebarView: {
    type: 'format',
    suggest: '@feature:sidebarView'
  },
  theme: {
    type: 'theme',
    suggest: '@feature:theme'
  }
} as const;

export const categoriesTipsMap = {
  'Data Migration': {
    type: 'format',
    suggest: '@category:Data Migration'
  },
  Themes: {
    type: 'format',
    suggest: '@category:Themes'
  },
  'API Security': {
    type: 'format',
    suggest: '@category:API Security'
  },
  Other: {
    type: 'format',
    suggest: '@category:Other'
  }
} as const;

export type FeatureContributionPoints = keyof typeof featuresTipsMap;
export type CategoryContributionPoints = keyof typeof categoriesTipsMap;
export type ContributionPoints = FeatureContributionPoints | CategoryContributionPoints;

export const contributionPoints = Object.keys(featuresTipsMap).concat(Object.keys(categoriesTipsMap));

export const getExtensionCates = () =>
  [
    {
      key: categoriesTipsMap['Data Migration'].suggest,
      title: $localize`Data Migration`,
      isLeaf: true
    },
    {
      key: categoriesTipsMap.Themes.suggest,
      title: $localize`Themes`,
      isLeaf: true
    },
    {
      key: categoriesTipsMap['API Security'].suggest,
      title: $localize`API Security`,
      isLeaf: true
    },
    {
      key: categoriesTipsMap.Other.suggest,
      title: $localize`Other`,
      isLeaf: true
    }
  ] as const;

export const suggestList = Object.values({ ...categoriesTipsMap, ...featuresTipsMap }).map(n => n.suggest);
