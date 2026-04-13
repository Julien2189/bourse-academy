import { Component } from '@angular/core';

@Component({
  selector: 'app-outils',
  standalone: true,
  imports: [],
  templateUrl: './outils.html',
  styleUrl: './outils.css',
})
export class Outils {

  toggleConcept(event: Event): void {
    const header = event.currentTarget as HTMLElement;
    const body = header.nextElementSibling as HTMLElement | null;
    const arrow = header.querySelector('.concept-arrow') as HTMLElement | null;

    body?.classList.toggle('open');
    arrow?.classList.toggle('open');
  }
}