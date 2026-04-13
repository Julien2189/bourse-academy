import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentsAvances } from './instruments-avances';

describe('InstrumentsAvances', () => {
  let component: InstrumentsAvances;
  let fixture: ComponentFixture<InstrumentsAvances>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstrumentsAvances]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstrumentsAvances);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
