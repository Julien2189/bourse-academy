import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppelMarge } from './appel-marge';

describe('AppelMarge', () => {
  let component: AppelMarge;
  let fixture: ComponentFixture<AppelMarge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppelMarge]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppelMarge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
