import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';

import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'eo-select-theme',
  templateUrl: './select-theme.component.html',
  styleUrls: ['./select-theme.component.scss'],
})
export class SelectThemeComponent implements OnInit, OnDestroy {
  @Input() visible: boolean;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();

  currentTheme: string;
  THEMES: any[];
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private theme: ThemeService) {
    this.currentTheme = this.theme.currentTheme;
    this.getThemes();
    this.theme
      .onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$)
      )
      .subscribe((name) => {
        this.currentTheme = name;
      });
  }
  private getThemes() {
    this.THEMES = this.theme.getThemes();
  }

  changeTheme(name: string) {
    this.theme.changeTheme(name);
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
