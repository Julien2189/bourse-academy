import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Glossaire } from './glossaire';

describe('Glossaire', () => {
  let component: Glossaire;
  let fixture: ComponentFixture<Glossaire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Glossaire]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Glossaire);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
