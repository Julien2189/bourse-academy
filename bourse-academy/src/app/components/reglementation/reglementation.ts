import { Component } from '@angular/core';

@Component({
  selector: 'app-reglementation',
  standalone: true,
  imports: [],
  templateUrl: './reglementation.html',
  styleUrl: './reglementation.css',
})
export class Reglementation {

  toggleConcept(event: Event): void {
    const header = event.currentTarget as HTMLElement;
    const body = header.nextElementSibling as HTMLElement | null;
    const arrow = header.querySelector('.concept-arrow') as HTMLElement | null;

    body?.classList.toggle('open');
    arrow?.classList.toggle('open');
  }

}