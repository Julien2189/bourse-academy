import { Component } from '@angular/core';

@Component({
  selector: 'app-contrats',
  standalone: true,
  imports: [],
  templateUrl: './contrats.html',
  styleUrl: './contrats.css',
})
export class Contrats {
  toggleConcept(event: Event): void {
    const header = event.currentTarget as HTMLElement;
    const body = header.nextElementSibling as HTMLElement | null;
    const arrow = header.querySelector('.concept-arrow') as HTMLElement | null;

    body?.classList.toggle('open');
    arrow?.classList.toggle('open');
  }
}