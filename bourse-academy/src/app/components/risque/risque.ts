import { Component } from '@angular/core';

@Component({
  selector: 'app-risque',
  standalone: true,
  imports: [],
  templateUrl: './risque.html',
  styleUrl: './risque.css',
})
export class Risque {

  toggleConcept(event: Event): void {
    const header = event.currentTarget as HTMLElement;
    const body = header.nextElementSibling as HTMLElement | null;
    const arrow = header.querySelector('.concept-arrow') as HTMLElement | null;

    body?.classList.toggle('open');
    arrow?.classList.toggle('open');
  }

}