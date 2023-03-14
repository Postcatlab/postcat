import { Injectable } from '@angular/core';
import * as Color from 'color';
import { capitalize, has, isNull } from 'lodash-es';

import { eoDeepCopy, JSONParse } from '../../../shared/utils/index.utils';
import _allThemeColors from './theme-colors.json';
import { DEFAULT_THEME_COLORS, SystemThemeItems } from './theme.constant';
import { ThemeColorRule, ThemeColors, ThemeColorSingleRule } from './theme.model';

const allThemeColors: ThemeColors = _allThemeColors;
@Injectable({
  providedIn: 'root'
})
export class ThemeVariableService {
  constructor() {
    // let color = Color('#fafafa').darken(0.03);
    // console.log('%c FILTER_COLOR:', `background:${'#fafafa'}`, '#fafafa');
    // console.log('%c FILTER_COLOR:', `background:${color.rgb().string()}`, color.rgb().string());
  }
  private initColorRule(base: 'dark' | 'light') {
    const colorsDefaultRule: ThemeColorRule[] = [
      {
        source: 'layoutSidebarText',
        rule: [
          {
            action: 'replace',
            target: ['menuItemText']
          },
          {
            action: 'filter',
            alpha: 0.1,
            target: ['menuItemActiveBackground']
          }
        ]
      },
      {
        source: 'layoutFooterText',
        rule: [
          {
            action: 'filter',
            alpha: 0.2,
            target: ['layoutFooterItemHoverBackground']
          }
        ]
      },
      {
        source: 'text',
        rule: [
          {
            action: 'replace',
            target: [
              'tableText',
              'selectText',
              'layoutSidebarText',
              'layoutHeaderText',
              'layoutFooterText',
              'iconText',
              'icon',
              'alertDefaultIcon',
              'buttonDefaultText',
              'buttonTextText',
              'buttonTextHoverText',
              'menuItemText',
              'tabsText',
              'tabsActiveText',
              'tabsCardText',
              'tabsCardItemActiveText',
              'tableFooterText',
              'treeText',
              'treeSelectedText',
              'treeHoverText',
              'buttonDefaultHoverText',
              'selectItemSelectedText',
              'selectDropdownText',
              'inputText',
              'modalHeaderText',
              'modalBodyText',
              'modalFooterText',
              'alertDefaultText',
              'checkboxText',
              'checkboxCheckedText',
              'radioText',
              'radioCheckedText',
              'switchCardText',
              'menuItemActiveText',
              'dropdownItemText',
              'dropdownItemHoverText'
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
            target: [
              'checkboxBorder',
              'tableBorder',
              'collapseBorder',
              'buttonBorder',
              'radioBorder',
              'switchCardBorder',
              'disabledBorder',
              'inputBorder',
              'selectBorder'
            ]
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
        source: 'hoverBorder',
        rule: [
          {
            action: 'replace',
            target: ['inputHoverBorder', 'selectHoverBorder']
          }
        ]
      },
      {
        source: 'activeBorder',
        rule: [
          {
            action: 'replace',
            target: ['inputActiveBorder', 'selectActiveBorder']
          }
        ]
      },
      {
        source: 'checkboxCheckedBackground',
        rule: [
          {
            action: 'replace',
            target: ['checkboxCheckedBorder']
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
        source: 'tabsBadge',
        rule: [
          {
            action: 'replace',
            target: ['tabsActiveBadge']
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
              'tabsBadge',
              'tabsActiveBadge',
              'buttonPrimaryBackground',
              'checkboxCheckedBackground',
              'radioCheckedBorder',
              'radioCheckedBackground',
              'checkboxCheckedBorder',
              'inputHoverBorder',
              'hoverBorder',
              'activeBorder',
              'inputActiveBorder',
              'selectHoverBorder',
              'selectActiveBorder',
              'spin'
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
            target: ['tabsCardItemActive']
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
              'layoutSidebarBackground',
              'layoutFooterBackground',
              'buttonDefaultBackground',
              'buttonDangerBackground',
              'buttonDangerHoverBackground',
              'buttonDangerActiveBackground',
              'tabsCardItemBackground',
              'tabsCardItemActiveBackground',
              'tableBackground',
              'tableFooterBackground',
              'treeHeaderBackground',
              'treeBackground',
              'dropdownMenuBackground',
              'selectBackground',
              'selectDropdownBackground',
              'inputBackground',
              'modalHeaderBackground',
              'modalBodyBackground',
              'modalFooterBackground',
              'paginationItemBackground',
              'paginationItemActiveBackground',
              'paginationButtonBackground',
              'checkboxBackground',
              'radioBackground',
              'collapseContentBackground',
              'tabsBackground'
            ]
          }
        ]
      },
      {
        source: 'barBackground',
        rule: [
          {
            action: 'replace',
            target: ['collapseHeaderBackground', 'tabsCardBackground', 'menuInlineSubmenuBackground']
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
              'layoutFooterItemHoverBackground'
            ]
          },
          {
            action: 'darken',
            alpha: 0.05,
            target: ['buttonTextHoverBackground']
          }
        ]
      },
      {
        source: 'buttonDefaultBorder',
        rule: [
          {
            action: 'replace',

            target: ['buttonDefaultActiveBorder', 'buttonDefaultHoverBorder']
          }
        ]
      },
      {
        source: 'buttonBorder',
        rule: [
          {
            action: 'replace',

            target: ['buttonPrimaryBorder', 'buttonDefaultBorder', 'buttonDefaultHoverBorder', 'buttonDefaultActiveBorder']
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
    //* AlertText generate Background
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

    //ItemHover
    if (base === 'light') {
      const barBackgroundRule = colorsDefaultRule.find(val => val.source === 'barBackground');
      barBackgroundRule.rule.push({
        action: 'darken',
        alpha: 0.025,
        target: ['itemHoverBackground', 'itemActiveBackground', 'layoutFooterItemHoverBackground']
      });

      barBackgroundRule.rule.push({
        action: 'darken',
        alpha: 0.02,
        target: ['tableHeaderBackground']
      });
    } else {
      const textRule = colorsDefaultRule.find(val => val.source === 'text');
      textRule.rule.push({
        action: 'filter',
        alpha: 0.2,
        target: ['itemHoverBackground', 'itemActiveBackground', 'layoutFooterItemHoverBackground']
      });

      const barBackgroundRule = colorsDefaultRule.find(val => val.source === 'barBackground');
      barBackgroundRule.rule.push({
        action: 'darken',
        alpha: 0.2,
        target: ['tableHeaderBackground']
      });
    }

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
      case 'darken': {
        try {
          const color = Color(colorValue);
          rule.target.forEach(keyName => {
            if (result[keyName]) return;
            result[keyName] = color.darken(rule.alpha).string();
          });
          // console.log('%c FILTER_COLOR:', `background:${color.alpha(rule.alpha).string()}`, color.alpha(rule.alpha).string());
        } catch (e) {
          pcConsole.error(`Colors can't ${colorKey} value parse error`);
        }
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
  private getColorsByCustomColors(base: 'dark' | 'light', customColors: Partial<ThemeColors>): ThemeColors {
    const rules = this.initColorRule(base);
    const result = eoDeepCopy(customColors);
    rules.forEach(singleRule => {
      if (singleRule.default && !(result[singleRule.target] || result[singleRule.source])) {
        result[singleRule.target || singleRule.source] = singleRule.default;
      }
      if (singleRule.source === 'barBackground' && result.primary === '#264653') {
        pcConsole.log(singleRule, eoDeepCopy(result));
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
   * @param defaultThemeOpts  base theme colors
   */
  getColors(
    theme,
    defaultThemeOpts: Partial<SystemThemeItems> = {
      customColors: {},
      colors: allThemeColors
    }
  ) {
    //* customRule > baseTheme.rule > system default
    const customColors = { ...defaultThemeOpts.customColors, ...(theme.core ? theme.customColors : theme.colors) };
    const baseThemeID = (theme.core ? theme.id : theme.baseTheme) || 'light';
    //Generate colors by custom colors
    const colors = this.getColorsByCustomColors(baseThemeID.includes('dark') ? 'dark' : 'light', customColors);
    const result = {} as ThemeColors;

    //Use default color if not set
    Object.keys(allThemeColors).forEach(colorKey => {
      if (!colors[colorKey]) {
        result[colorKey] = defaultThemeOpts.colors[colorKey] || DEFAULT_THEME_COLORS[colorKey];
      } else {
        result[colorKey] = colors[colorKey];
      }
      if (!result[colorKey]) {
        pcConsole.error(`Colors can't find ${colorKey} value`);
      }
    });
    result['systemBorder'] = result.border === 'transparent' ? result.inputBorder : result.border;
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
    return JSONParse(rule);
  }
}
