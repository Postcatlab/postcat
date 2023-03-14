import { Injectable } from '@angular/core';

import { ExtensionService } from '../../../services/extensions/extension.service';
import { ThemeVariableService } from './theme-variable.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeExtensionService {
  constructor(private extension: ExtensionService, private themeVariable: ThemeVariableService) {}
  getExtensionThemes(coreThemes) {
    const result = [];
    const features = this.extension.getValidExtensionsByFature('theme');
    features.forEach((feature, extensionID) => {
      feature.theme.forEach(theme => {
        result.push({
          label: theme.label,
          id: this.getExtensionID(extensionID, theme.id),
          isExtension: true,
          baseTheme: theme.baseTheme,
          colors: this.themeVariable.getColors(theme, coreThemes.find(val => val.id === theme.baseTheme) || coreThemes[0])
        });
      });
    });
    return result;
  }
  getExtensionID(name, themeID) {
    return `${name}_${themeID}`;
  }
}
