import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fiscalite } from './fiscalite';

describe('Fiscalite', () => {
  let component: Fiscalite;
  let fixture: ComponentFixture<Fiscalite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fiscalite]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fiscalite);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
