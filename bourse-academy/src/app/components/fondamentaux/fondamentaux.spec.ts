import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fondamentaux } from './fondamentaux';

describe('Fondamentaux', () => {
  let component: Fondamentaux;
  let fixture: ComponentFixture<Fondamentaux>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fondamentaux]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fondamentaux);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
