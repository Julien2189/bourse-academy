import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Actifs } from './actifs';

describe('Actifs', () => {
  let component: Actifs;
  let fixture: ComponentFixture<Actifs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Actifs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Actifs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
