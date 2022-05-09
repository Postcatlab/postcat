import { Component, OnInit } from '@angular/core';
import { NzTabPosition } from 'ng-zorro-antd/tabs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'eo-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  isVisible = false;
  isModal = false;
  position: NzTabPosition = 'left';
  modules = [];
  settings = {};
  validateForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.init();
  }

  private init() {
    if (window.eo && window.eo.getFeature) {
      this.isVisible = true;
      this.settings = window.eo.getSettings();
      const featureList = window.eo.getFeature('configuration');
      const controls = {};
      featureList?.forEach((feature: object, key: string) => {
        if (!feature['title'] || !feature['properties'] || typeof feature['properties'] !== 'object') {
          return true;
        }
        if (!this.settings[key] || typeof this.settings[key] !== 'object') {
          this.settings[key] = {};
        }
        const fields = [];
        for (let field_key in feature['properties']) {
          let field = feature['properties'][field_key]; 
          // 加入允许的type限制
          if (!field['type'] || !field['label']) {
            continue;
          }
          if ('select' === field['type'] && !field['options']) {
            continue;
          }
          const name = key + '_' + field_key;
          field = Object.assign({
            name: name,
            key: field_key,
            required: false,
            default: '',
            description: ''
          }, field);
          fields.push(field);
          if (!this.settings[key][field_key]) {
            this.settings[key][field_key] = field['default'];
          }
          // 可扩展加入更多默认校验
          if (field.required) {
            controls[name] = [null, [Validators.required]];
          } else {
            controls[name] = [null]; 
          }
        }
        this.modules.push({
          key: key,
          title: feature['title'],
          fields: fields,
        });
      });
      this.validateForm = this.fb.group(controls);
    }
  }

  handleShowModal() {
    this.isModal = true;
  }

  handleSave(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.validateForm.status === 'INVALID') {
      return;
    }
    // 加入根据返回显示提示消息
    const saved = window.eo.saveSettings(this.settings);
    if (saved) {
      this.handleCancel();
    }
  }

  handleCancel(): void {
    this.isModal = false;
  }
}
