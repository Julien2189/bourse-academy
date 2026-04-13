import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderShell } from './header-shell';

describe('HeaderShell', () => {
  let component: HeaderShell;
  let fixture: ComponentFixture<HeaderShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderShell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderShell);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
