import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Psychologie } from './psychologie';

describe('Psychologie', () => {
  let component: Psychologie;
  let fixture: ComponentFixture<Psychologie>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Psychologie]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Psychologie);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
