import { ExtensionInfo } from 'pc/browser/src/app/shared/models/extension-manager';

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
    name: $localize`format`,
    suggest: '@feature:importAPI'
  },
  exportAPI: {
    name: $localize`format`,
    suggest: '@feature:exportAPI'
  },
  pushAPI: {
    name: $localize`format`,
    suggest: '@feature:pushAPI'
  },
  syncAPI: {
    name: $localize`format`,
    suggest: '@feature:syncAPI'
  },
  pullAPI: {
    name: $localize`format`,
    suggest: '@feature:pullAPI'
  },
  authAPI: {
    name: $localize`format`,
    suggest: '@feature:authAPI'
  },
  sidebarView: {
    name: $localize`format`,
    suggest: '@feature:sidebarView'
  },
  theme: {
    name: 'theme',
    suggest: '@feature:theme'
  }
} as const;

export const categoriesTipsMap = {
  'Data Migration': {
    name: $localize`format`,
    suggest: '@category:Data Migration'
  },
  'API Testing': {
    name: $localize`extensions`,
    suggest: '@category:API Testing'
  },
  Themes: {
    name: $localize`themes`,
    suggest: '@category:Themes'
  },
  'API Security': {
    name: $localize`extensions`,
    suggest: '@category:API Security'
  },
  Other: {
    name: $localize`format`,
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
      key: categoriesTipsMap['API Testing'].suggest,
      title: $localize`API Testing`,
      isLeaf: true
    },
    {
      key: categoriesTipsMap.Other.suggest,
      title: $localize`Other`,
      isLeaf: true
    }
  ] as const;

export const suggestList = Object.values({ ...categoriesTipsMap, ...featuresTipsMap }).map(n => n.suggest);
