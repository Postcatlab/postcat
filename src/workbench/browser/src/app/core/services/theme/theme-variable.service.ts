import { Injectable } from '@angular/core';
import * as Color from 'color';
import { capitalize, has, isNull } from 'lodash-es';

import { eoDeepCopy } from '../../../utils/index.utils';
import _allThemeColors from './theme-colors.json';
import { DEFAULT_THEME_COLORS, SystemThemeItems } from './theme.constant';
import { ThemeColorRule, ThemeColors, ThemeColorSingleRule } from './theme.model';

const allThemeColors: ThemeColors = _allThemeColors;
@Injectable({
  providedIn: 'root'
})
export class ThemeVariableService {
  constructor() {}
  private initColorRule() {
    const colorsDefaultRule: ThemeColorRule[] = [
      {
        source: 'text',
        rule: [
          {
            action: 'replace',
            target: [
              'tableText',
              'selectText',
              'layoutSiderText',
              'layoutHeaderText',
              'layoutFooterText',
              'iconText',
              'alertDefaultIcon',
              'buttonDefaultText',
              'buttonTextText',
              'buttonTextHoverText',
              'tabsText',
              'tabsActiveText',
              'tabsCardText',
              'tabsCardActiveText',
              'tableFooterText',
              'treeText',
              'treeSelectedText',
              'treeHoverText',
              'buttonDefaultHoverText',
              'selectItemSelectedText',
              'selectDropdownText',
              'inputText',
              'modalHeaderText',
              'modalContentText',
              'modalFooterText',
              'alertDefaultText',
              'checkboxText',
              'checkboxCheckedText',
              'radioText',
              'radioCheckedText',
              'switchCardText',
              'menuItemText',
              'menuItemActiveText'
            ]
          }
        ]
      },
      {
        source: 'buttonTextText',
        rule: [
          {
            action: 'replace',
            target: ['buttonTextHoverText']
          }
        ]
      },
      {
        source: 'border',
        rule: [
          {
            action: 'replace',
            target: ['checkboxBorder', 'buttonBorder', 'radioBorder', 'switchCardBorder', 'disabledBorder', 'inputBorder', 'selectBorder']
          }
        ]
      },
      {
        source: 'textSecondary',
        rule: [
          {
            action: 'replace',
            target: ['tableHeaderText', 'menuItemGroupTitleText']
          }
        ]
      },
      {
        source: 'disabledText',
        default: '#bbb',
        rule: [
          {
            action: 'replace',
            target: ['inputPlaceholder']
          }
        ]
      },
      {
        source: 'inputHoverBorder',
        rule: [
          {
            action: 'replace',
            target: ['inputActiveBorder']
          }
        ]
      },
      {
        source: 'radioCheckedBackground',
        rule: [
          {
            action: 'replace',
            target: ['radioCheckedBorder']
          }
        ]
      },
      {
        source: 'primary',
        rule: [
          {
            action: 'replace',
            target: [
              'menuItemActive',
              'switchActive',
              'tabsActive',
              'buttonPrimaryBackground',
              'checkboxCheckedBackground',
              'radioCheckedBorder',
              'radioCheckedBackground',
              'checkboxCheckedBorder',
              'inputHoverBorder',
              'inputActiveBorder',
              'selectHoverBorder',
              'selectActiveBorder'
            ]
          },
          {
            action: 'filter',
            alpha: 0.8,
            target: ['primaryHover']
          }
        ]
      },
      {
        source: 'tabsActive',
        rule: [
          {
            action: 'replace',
            target: ['tabsCardActive']
          }
        ]
      },
      {
        source: 'primaryHover',
        rule: [
          {
            action: 'replace',
            target: [
              'buttonPrimaryHoverBackground',
              'buttonPrimaryActiveBackground',
              'buttonPrimaryHoverBorder',
              'buttonPrimaryActiveBorder'
            ]
          }
        ]
      },
      {
        source: 'shadow',
        rule: [
          {
            action: 'replace',
            target: [
              'successShadow',
              'warningShadow',
              'dangerShadow',
              'infoShadow',
              'buttonShadow',
              'buttonPrimaryShadow',
              'buttonDefaultShadow',
              'buttonDangerShadow'
            ]
          }
        ]
      },
      {
        source: 'background',
        rule: [
          {
            action: 'replace',
            target: [
              'switchCardBackground',
              'switchBakcground',
              'menuBackground',
              'layoutHeaderBackground',
              'layoutSiderBackground',
              'layoutFooterBackground',
              'buttonDefaultBackground',
              'buttonDangerBackground',
              'buttonDangerHoverBackground',
              'buttonDangerActiveBackground',
              'tabsCardBackground',
              'tabsCardActiveBackground',
              'tableBackground',
              'tableFooterBackground',
              'treeHeaderBackground',
              'treeBackground',
              'dropdownMenuBackground',
              'selectBackground',
              'selectDropdownBackground',
              'inputBackground',
              'modalHeaderBackground',
              'modalContentBackground',
              'modalFooterBackground',
              'paginationItemBackground',
              'paginationItemActiveBackground',
              'paginationButtonBackground',
              'checkboxBackground',
              'radioBackground',
              'collapseContentbackground'
            ]
          }
        ]
      },
      {
        source: 'barBackground',
        rule: [
          {
            action: 'replace',
            target: ['tableHeaderBackground', 'collapseHeaderBackground', 'tabsCardBarBackground', 'menuInlineSubmenuBackground']
          }
        ]
      },
      {
        source: 'itemActiveBackground',
        rule: [
          {
            action: 'replace',
            target: [
              'treeSelectedBackground',
              'selectItemSelectedBackground',
              'itemHoverBackground',
              'menuItemActiveBackground',
              'buttonDefaultActiveBorder',
              'buttonDefaultActiveBackground'
            ]
          }
        ]
      },
      {
        source: 'itemHoverBackground',
        rule: [
          {
            action: 'replace',
            target: [
              'dropdownItemHoverBackground',
              'tableRowHoverBackground',
              'treeHoverBackground',
              'buttonDefaultHoverBackground',
              'buttonTextHoverBackground'
            ]
          }
        ]
      },
      {
        source: 'buttonBorder',
        rule: [
          {
            action: 'replace',

            target: ['buttonPrimaryBorder', 'buttonDefaultHoverBorder', 'buttonDefaultBorder', 'buttonDefaultActiveBorder']
          }
        ]
      }
    ];
    const multipleColors: ThemeColorSingleRule[] = [
      {
        action: 'replace',
        target: ['toast${key}Text', 'button${key}Text', 'button${key}Border', 'alert${key}Text']
      },
      {
        action: 'filter',
        alpha: 0.8,
        target: ['${key}Hover']
      }
    ];
    ['success', 'danger', 'warning', 'info'].forEach(colorKey => {
      let rule: any = this.replaceKey(multipleColors, colorKey);
      switch (colorKey) {
        case 'danger': {
          rule[0].target = [
            ...rule[0].target,
            'alertErrorText',
            'toastErrorText',
            'progressException',
            'buttonDangerText',
            'buttonDangerHoverBorder',
            'buttonDangerActiveBorder'
          ];
          break;
        }
        case 'info': {
          rule[0].target.push('progressDefault');
          break;
        }
      }
      rule.forEach((val, key) => {
        val.target = val.target.filter(val => !isNull(val));
      });
      rule = rule.filter(val => val.target?.length);
      colorsDefaultRule.push({
        source: colorKey,
        rule: rule
      });
    });
    colorsDefaultRule.push({
      source: 'dangerHover',
      rule: [
        {
          action: 'replace',
          target: ['buttonDangerHoverText']
        }
      ]
    });

    //Toast/Alert
    const alertColors: ThemeColorSingleRule[] = [
      {
        action: 'replace',
        target: ['${key}Icon']
      },
      {
        action: 'filter',
        alpha: 0.1,
        target: ['${key}Background']
      }
    ];
    ['alert', 'toast'].forEach(component => {
      let rules = eoDeepCopy(alertColors);
      rules.forEach(val => {
        val.target = val.target.map(val => `${component}${val}`);
      });
      ['success', 'error', 'warning', 'info'].forEach(colorKey => {
        let rule: any = this.replaceKey(rules, colorKey);
        rule.forEach(val => {
          val.target = val.target.filter(val => !isNull(val));
        });
        rule = rule.filter(val => val.target?.length);
        colorsDefaultRule.push({
          source: `${component}${capitalize(colorKey)}Text`,
          rule: rule
        });
      });
    });
    return colorsDefaultRule;
  }
  private getColorsBySingleRule(rule: ThemeColorSingleRule, opts: { customColors: Partial<ThemeColors>; colorKey: string }) {
    const result = opts.customColors;
    const colorKey = opts.colorKey;
    const colorValue = opts.customColors[colorKey];
    if (!colorValue) {
      // pcConsole.warn(`GetColorsBySingleRule colors can't find ${colorKey} value`);
      return result;
    }
    switch (rule.action) {
      case 'replace': {
        rule.target.forEach(keyName => {
          if (result[keyName]) return;
          result[keyName] = colorValue;
        });
        break;
      }
      case 'filter': {
        try {
          const color = Color(colorValue);
          rule.target.forEach(keyName => {
            if (result[keyName]) return;
            result[keyName] = color.alpha(rule.alpha).string();
          });
          // console.log('%c FILTER_COLOR:', `background:${color.alpha(rule.alpha).string()}`, color.alpha(rule.alpha).string());
        } catch (e) {
          pcConsole.error(`Colors can't ${colorKey} value parse error`);
        }

        break;
      }
    }
    return result;
  }
  private getColorsByCustomColors(customColors: Partial<ThemeColors>): ThemeColors {
    const rules = this.initColorRule();
    const result = eoDeepCopy(customColors);
    rules.forEach(singleRule => {
      if (singleRule.default && !(result[singleRule.target] || result[singleRule.source])) {
        result[singleRule.target || singleRule.source] = singleRule.default;
      }
      if (singleRule.rule) {
        singleRule.rule.forEach(rule => {
          Object.assign(
            result,
            this.getColorsBySingleRule(rule, {
              colorKey: singleRule.source,
              customColors: result
            })
          );
        });
      }
    });
    return result as ThemeColors;
  }

  /**
   * Get all colors by basic colors
   *
   * @param customColors  custom theme colors
   * @param baseTheme  base theme colors
   */
  getColors(
    customColors,
    baseTheme: Partial<SystemThemeItems> = {
      customColors: {},
      colors: allThemeColors
    }
  ) {
    //* customRule > baseTheme.rule > system default
    customColors = { ...DEFAULT_THEME_COLORS, ...baseTheme.customColors, ...customColors };

    //Generate colors by custom colors
    const colors = this.getColorsByCustomColors(customColors);
    const result = {} as ThemeColors;
    //Use default color if not set
    Object.keys(allThemeColors).forEach(colorKey => {
      if (!colors[colorKey]) {
        result[colorKey] = baseTheme.colors[colorKey];
      } else {
        result[colorKey] = colors[colorKey];
      }
      if (!result[colorKey]) {
        pcConsole.error(`Colors can't find ${colorKey} value`);
      }
    });
    // pcConsole.log('getColors:', result);
    return result;
  }
  private replaceKey(origin, replaceValue, replaceKey = '${key}') {
    const rule = JSON.stringify(origin, (k, v) => {
      if (typeof v !== 'string') return v;
      let result = v;
      if (v.startsWith(replaceKey)) {
        result = v.replace(replaceKey, replaceValue);
      } else if (v.includes(replaceKey)) {
        result = v.replace(replaceKey, capitalize(replaceValue));
      }
      //Repalce key is not color key
      if (result !== v && !has(allThemeColors, result)) {
        return;
      }
      return result;
    });
    return JSON.parse(rule);
  }
}
