const { execSync } = require('child_process');
const components = [
  'eo-ng-auto-complete',
  'eo-ng-breadcrumb',
  'eo-ng-button',
  'eo-ng-card-switch',
  'eo-ng-cascader',
  'eo-ng-checkbox',
  'eo-ng-codebox',
  'eo-ng-copy',
  'eo-ng-counter',
  'eo-ng-date-picker',
  'eo-ng-dropdown',
  'eo-ng-empty',
  'eo-ng-feedback',
  'eo-ng-input',
  'eo-ng-layout',
  'eo-ng-menu',
  'eo-ng-radio',
  'eo-ng-select',
  'eo-ng-switch',
  'eo-ng-table',
  'eo-ng-tabs',
  'eo-ng-tree',
  'eo-ng-upload'
];
components.forEach(name => {
  execSync(`yarn unlink ${name}`, { stdio: 'inherit' });
});
