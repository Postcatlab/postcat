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
    const colorsDefaultRule = {
      buttonPrimaryText: '#fff',
      modalMaskBackground: 'rgba(0, 0, 0, 0.35)',
      checkboxCheckedBorder: 'transparent',
      switchText: '#fff',
      scrollbarThumbBackground: 'rgba(0, 0, 0, 0.2)',
      scrollbarTrackBackground: 'rgba(255, 255, 255, 0.05)',
      radioCheckedBorder: 'transparent',
      text: {
        action: 'replace',
        targets: [
          'layoutSiderText',
          'layoutSiderItemActiveText',
          'layoutFooterText',
          'iconText',
          'alertDefaultIcon',
          'buttonDefaultText',
          'buttonDangerText',
          'tabsText',
          'tabsActiveText',
          'tabsCardText',
          'tabsCardActiveText',
          'tableFooterText',
          'treeText',
          'treeSelectedText',
          'treeHoverText',
          'selectItemSelectedText',
          'inputText',
          'modalHeaderText',
          'alertDefaultText',
          'checkboxText',
          'checkboxCheckedText',
          'radioText',
          'radioCheckedText',
          'switchCardText',
          'menuItemText'
        ]
      },
      border: {
        action: 'replace',
        targets: ['selectBorder', 'inputBorder', 'checkboxBorder', 'radioBorder', 'switchCardBorder', 'disabledBorder']
      },
      textSecondary: {
        action: 'replace',
        targets: ['tableHeaderText', 'disabledText', 'menuItemGroupTitleText']
      },
      disabledText: {
        action: 'replace',
        targets: ['inputPlaceholder', 'inputIcon']
      },
      primary: [
        {
          action: 'replace',
          targets: [
            'menuItemActiveText',
            'menuItemActive',
            'switchActive',
            'tabsCardActive',
            'tabsActive',
            'buttonPrimaryBackground',
            'checkboxCheckedBackground',
            'radioCheckedBackground',
            'selectBorder',
            'inputBorder'
          ]
        },
        {
          action: 'filter',
          alpha: 0.2,
          targets: ['menuItemActiveBackground']
        }
      ],
      shadow: {
        action: 'replace',
        targets: [
          'successShadow',
          'warningShadow',
          'dangerShadow',
          'infoShadow',
          'buttonShadow',
          'buttonPrimaryShadow',
          'buttonDefaultShadow',
          'buttonDangerShadow'
        ]
      },
      background: {
        action: 'replace',
        targets: [
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
      },
      barBackground: {
        action: 'replace',
        targets: ['tableHeaderBackground', 'collapseHeaderBackground', 'tabsCardBarBackground', 'menuInlineSubmenuBackground']
      },
      itemActiveBackground: {
        action: 'replace',
        targets: ['treeSelectedBackground', 'selectItemSelectedBackground', 'layoutSiderItemActive', 'itemHoverBackground']
      },
      itemHoverBackground: {
        action: 'replace',
        targets: ['dropdownItemHoverBackground', 'tableRowHoverBackground', 'treeHoverBackground']
      }
    };
    const multipleColors: ThemeColorRule[] = [
      {
        action: 'replace',
        targets: ['toast${key}Text', 'button${key}Text', 'toast${key}Icon', 'alert${key}Text', 'alert${key}Icon']
      },
      {
        action: 'filter',
        alpha: 0.1,
        targets: ['toast${key}Background', 'alert${key}Background']
      },
      {
        action: 'filter',
        alpha: 0.6,
        targets: ['${key}Hover']
      }
    ];
    const replaceKey = '${key}';
    ['success', 'danger', 'warning', 'info'].forEach(colorKey => {
      const rule = JSON.stringify(multipleColors, (k, v) => {
        if (typeof v !== 'string') return v;
        let result = v;
        if (v.startsWith(replaceKey)) {
          result = v.replace(replaceKey, colorKey);
        }
        if (v.includes(replaceKey)) {
          result = v.replace(replaceKey, capitalize(colorKey));
        }
        if (result !== v && !has(allThemeColors, result)) {
          return;
        }
        return result;
      });
      colorsDefaultRule[colorKey] = JSON.parse(rule);
      if (colorKey === 'danger') {
        colorsDefaultRule[colorKey][0].targets = [
          ...colorsDefaultRule[colorKey][0].targets,
          'alertErrorText',
          'toastErrorIcon',
          'toastErrorText',
          'alertErrorIcon'
        ];
        colorsDefaultRule[colorKey][1].targets = [
          ...colorsDefaultRule[colorKey][1].targets,
          'alertErrorBackground',
          'toastErrorBackground'
        ];
      }
      colorsDefaultRule[colorKey].forEach((val, key) => {
        val.targets = val.targets.filter(val => !isNull(val));
      });
      colorsDefaultRule[colorKey] = colorsDefaultRule[colorKey].filter(val => val.targets?.length);
    });
    return colorsDefaultRule;
  }
  private getColorsBySingleRule(colorKey: string, rule: ThemeColorRule, colors: ThemeColors) {
    const result = {};
    switch (rule.action) {
      case 'replace': {
        rule.targets.forEach(keyName => {
          result[keyName] = colors[colorKey];
        });
        break;
      }
      case 'filter': {
        const color = Color(colors[colorKey]);
        rule.targets.forEach(keyName => {
          result[keyName] = color.fade(rule.alpha).string();
        });
        // console.log('%c FILTER_COLOR:', `background:${color.fade(rule.alpha).string()}`);
        break;
      }
    }
    return result;
  }
  private getColorsByRule(rules, colors: ThemeColors) {
    const result = colors;
    Object.keys(rules).forEach(colorKey => {
      const rule = rules[colorKey];
      const type = whatType(rule);
      switch (type) {
        case 'string': {
          //Default value
          result[colorKey] = rule;
          break;
        }
        case 'object': {
          Object.assign(result, this.getColorsBySingleRule(colorKey, rule, colors));
          break;
        }
        case 'array': {
          rule.forEach(val => {
            Object.assign(result, this.getColorsBySingleRule(colorKey, val, colors));
          });
          break;
        }
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
    //Use custom colors to replace default colors
    Object.assign(
      result,
      omitBy(customColors, v => isUndefined(v) || isNull(v) || v === '')
    );
    //Check all colors is exist
    let allColorVariableIsExist = Object.keys(allThemeColors).every(keyName => result[keyName]);
    if (!allColorVariableIsExist) {
      pcConsole.error('Lack of theme variables!', result);
    }
    pcConsole.log('getColors', result);
    return result;
  }
}
