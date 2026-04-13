import { Component } from '@angular/core';

@Component({
  selector: 'app-analyse',
  standalone: true,
  imports: [],
  templateUrl: './analyse.html',
  styleUrl: './analyse.css',
})
export class Analyse {

  toggleConcept(event: Event): void {
    const header = event.currentTarget as HTMLElement;
    const body = header.nextElementSibling as HTMLElement | null;
    const arrow = header.querySelector('.concept-arrow') as HTMLElement | null;

    body?.classList.toggle('open');
    arrow?.classList.toggle('open');
  }

  switchTabAnalyse(id: string, event: Event): void {
    const btn = event.currentTarget as HTMLElement;

    document.querySelectorAll('#analyseTabs .tab').forEach(tab => {
      tab.classList.remove('active');
    });

    document.querySelectorAll('#analyse .tab-panel').forEach(panel => {
      panel.classList.remove('active');
    });

    btn.classList.add('active');
    document.getElementById(id)?.classList.add('active');
  }
}