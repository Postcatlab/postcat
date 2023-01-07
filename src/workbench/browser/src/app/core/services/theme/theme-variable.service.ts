import { Injectable } from '@angular/core';
import * as Color from 'color';
import { capitalize, has, isNull, isUndefined, omitBy } from 'lodash-es';

import { eoDeepCopy, whatType } from '../../../utils/index.utils';
import _allThemeColors from './theme-colors.json';
import { ThemeColorRule, ThemeColors } from './theme.model';
const allThemeColors: ThemeColors = _allThemeColors;
@Injectable({
  providedIn: 'root'
})
export class ThemeVariableService {
  constructor() {}
  private initColorRule() {
    const colorsDefaultRule = [
      {
        target: 'buttonPrimaryText',
        default: '#fff'
      },
      {
        target: 'checkboxCheckedBorder',
        default: 'transparent'
      },
      {
        target: 'modalMaskBackground',
        default: 'rgba(0, 0, 0, 0.35)'
      },
      {
        target: 'popoverBackground',
        default: 'rgba(0,0,0,.75)'
      },
      {
        target: 'popoverText',
        default: '#fff'
      },
      {
        target: 'switchText',
        default: '#fff'
      },
      {
        target: 'scrollbarThumbBackground',
        default: 'rgba(0, 0, 0, 0.2)'
      },
      {
        target: 'scrollbarTrackBackground',
        default: 'rgba(255, 255, 255, 0.05)'
      },
      {
        target: 'progressSuccess',
        default: '#52c41a'
      },
      {
        target: 'toastSuccessText',
        default: '#2ca641'
      },
      {
        target: 'alertSuccessText',
        default: '#2ca641'
      },
      {
        source: 'text',
        rule: [
          {
            action: 'replace',
            target: [
              'tableText',
              'selectText',
              'layoutSiderText',
              'layoutFooterText',
              'iconText',
              'alertDefaultIcon',
              'buttonDefaultText',
              'tabsText',
              'tabsActiveText',
              'tabsCardText',
              'tabsCardActiveText',
              'tableFooterText',
              'treeText',
              'treeSelectedText',
              'treeHoverText',
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
        source: 'border',
        rule: [
          {
            action: 'replace',
            target: ['checkboxBorder', 'radioBorder', 'switchCardBorder', 'disabledBorder', 'inputBorder', 'selectBorder']
          }
        ]
      },
      {
        source: 'textSecondary',
        rule: [
          {
            action: 'replace',
            target: ['tableHeaderText', 'disabledText', 'menuItemGroupTitleText']
          }
        ]
      },
      {
        source: 'disabledText',
        rule: [
          {
            action: 'replace',
            target: ['inputPlaceholder']
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
            target: ['treeSelectedBackground', 'selectItemSelectedBackground', 'itemHoverBackground', 'menuItemActiveBackground']
          }
        ]
      },
      {
        source: 'itemHoverBackground',
        rule: [
          {
            action: 'replace',
            target: ['dropdownItemHoverBackground', 'tableRowHoverBackground', 'treeHoverBackground']
          }
        ]
      }
    ];
    const multipleColors: ThemeColorRule[] = [
      {
        action: 'replace',
        target: ['toast${key}Text', 'button${key}Text', 'alert${key}Text']
      },
      {
        action: 'filter',
        alpha: 0.6,
        target: ['${key}Hover']
      }
    ];
    ['success', 'danger', 'warning', 'info'].forEach(colorKey => {
      let rule: any = this.replaceKey(multipleColors, colorKey);
      rule = JSON.parse(rule);
      switch (colorKey) {
        case 'danger': {
          rule[0].target = [...rule[0].target, 'alertErrorText', 'toastErrorText', 'progressException', 'buttonDangerText'];
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
    //Toast/Alert
    const alertColors: ThemeColorRule[] = [
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
        rule = JSON.parse(rule);
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
  private getColorsBySingleRule(colorKey: string, rule: ThemeColorRule, colors: ThemeColors) {
    const result = colors;
    switch (rule.action) {
      case 'replace': {
        rule.target.forEach(keyName => {
          if (result[keyName]) return;
          result[keyName] = colors[colorKey];
        });
        break;
      }
      case 'filter': {
        if (!colors[colorKey]) {
          pcConsole.error(`colors can't find ${colorKey} value`);
          break;
        }
        const color = Color(colors[colorKey]);
        rule.target.forEach(keyName => {
          if (result[keyName]) return;
          result[keyName] = color.alpha(rule.alpha).string();
        });
        // console.log('%c FILTER_COLOR:', `background:${color.alpha(rule.alpha).string()}`, color.alpha(rule.alpha).string());
        break;
      }
    }
    return result;
  }
  private getColorsByRule(rules, colors: ThemeColors) {
    const result = colors;
    rules.forEach(singleRule => {
      if (singleRule.default && !result[singleRule.target]) {
        result[singleRule.target] = singleRule.default;
      }
      if (singleRule.rule) {
        singleRule.rule.forEach(val => {
          Object.assign(result, this.getColorsBySingleRule(singleRule.source, val, result));
        });
      }
    });
    return result;
  }

  /**
   * Get all colors by basic colors
   *
   * @param customColors  custom theme colors
   * @param baseColors  base theme colors
   */
  getColors(customColors, baseColors = allThemeColors) {
    let result = eoDeepCopy(baseColors);
    const colorsRule = this.initColorRule();
    //Set custom colors
    Object.keys(customColors).forEach(colorKey => {
      if (!has(allThemeColors, colorKey)) {
        pcConsole.warn(`Color ${colorKey} is not exist!`);
        return;
      }
      result[colorKey] = customColors[colorKey];
    });
    //Generate colors by rule
    result = this.getColorsByRule(colorsRule, result);
    //Check all colors is exist
    let allColorVariableIsExist = Object.keys(allThemeColors).every(keyName => result[keyName]);
    if (!allColorVariableIsExist) {
      pcConsole.error('Lack of theme variables!', result);
    }
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
    return rule;
  }
}
