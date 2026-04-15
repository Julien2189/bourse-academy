import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header-shell',
  standalone: true,
  imports: [],
  templateUrl: './header-shell.html',
  styleUrl: './header-shell.css',
})
export class HeaderShell {
  @Output() themeToggle = new EventEmitter<void>();
  @Output() apiToggle = new EventEmitter<void>();
  @Output() apiSave = new EventEmitter<void>();
  @Output() apiClear = new EventEmitter<void>();
  @Output() menuToggle = new EventEmitter<void>();
  @Output() menuClose = new EventEmitter<void>();

  toggleTheme(): void {
    this.themeToggle.emit();
  }

  toggleApiDrawer(): void {
    this.apiToggle.emit();
  }

  saveAndFetch(): void {
    this.apiSave.emit();
  }

  clearApiKey(): void {
    this.apiClear.emit();
  }

  toggleMenu(): void {
    this.menuToggle.emit();
  }

  closeMenu(): void {
    this.menuClose.emit();
  }
}