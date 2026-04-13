import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Risque } from './risque';

describe('Risque', () => {
  let component: Risque;
  let fixture: ComponentFixture<Risque>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Risque]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Risque);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
