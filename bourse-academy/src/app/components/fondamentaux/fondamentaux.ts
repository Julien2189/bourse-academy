import { Component } from '@angular/core';

@Component({
  selector: 'app-fondamentaux',
  standalone: true,
  imports: [],
  templateUrl: './fondamentaux.html',
  styleUrl: './fondamentaux.css',
})
export class Fondamentaux {

  toggleConcept(event: Event): void {
    const header = event.currentTarget as HTMLElement;
    const body = header.nextElementSibling as HTMLElement | null;
    const arrow = header.querySelector('.concept-arrow') as HTMLElement | null;

    body?.classList.toggle('open');
    arrow?.classList.toggle('open');
  }
}