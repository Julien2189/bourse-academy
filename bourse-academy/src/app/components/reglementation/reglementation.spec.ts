import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reglementation } from './reglementation';

describe('Reglementation', () => {
  let component: Reglementation;
  let fixture: ComponentFixture<Reglementation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reglementation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reglementation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
