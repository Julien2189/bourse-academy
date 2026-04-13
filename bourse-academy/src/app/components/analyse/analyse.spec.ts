import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Analyse } from './analyse';

describe('Analyse', () => {
  let component: Analyse;
  let fixture: ComponentFixture<Analyse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Analyse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Analyse);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
