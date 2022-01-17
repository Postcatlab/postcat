import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { STORAGE_CONFIG, StorageConfig } from './storage.config';
import { StorageService } from './storage.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class StorageModule {
  static forRoot(config: StorageConfig): ModuleWithProviders<StorageModule> {
    return {
      ngModule: StorageModule,
      providers: [{ provide: STORAGE_CONFIG, useValue: config }, StorageService]
    };
  }
}
