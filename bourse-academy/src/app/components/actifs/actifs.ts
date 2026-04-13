import { Component } from '@angular/core';

@Component({
  selector: 'app-actifs',
  standalone: true,
  imports: [],
  templateUrl: './actifs.html',
  styleUrl: './actifs.css',
})
export class Actifs {
  toggleConcept(event: Event): void {
    const header = event.currentTarget as HTMLElement;
    const body = header.nextElementSibling as HTMLElement | null;
    const arrow = header.querySelector('.concept-arrow') as HTMLElement | null;

    body?.classList.toggle('open');
    arrow?.classList.toggle('open');
  }

  switchTab(id: string, event: Event): void {
    const btn = event.currentTarget as HTMLElement;

    document.querySelectorAll('#assetTabs .tab').forEach(tab => {
      tab.classList.remove('active');
    });

    document.querySelectorAll('#actifs .tab-panel').forEach(panel => {
      panel.classList.remove('active');
    });

    btn.classList.add('active');
    document.getElementById(id)?.classList.add('active');
  }
}