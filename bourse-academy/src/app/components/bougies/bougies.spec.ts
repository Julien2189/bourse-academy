import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bougies } from './bougies';

describe('Bougies', () => {
  let component: Bougies;
  let fixture: ComponentFixture<Bougies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bougies]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bougies);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
