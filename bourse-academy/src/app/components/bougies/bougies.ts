import { Component } from '@angular/core';

@Component({
  selector: 'app-bougies',
  standalone: true,
  imports: [],
  templateUrl: './bougies.html',
  styleUrl: './bougies.css',
})
export class Bougies {
  toggleConcept(event: Event): void {
    const header = event.currentTarget as HTMLElement;
    const body = header.nextElementSibling as HTMLElement;
    const arrow = header.querySelector('.concept-arrow') as HTMLElement;

    body.classList.toggle('open');
    arrow.classList.toggle('open');
  }
}