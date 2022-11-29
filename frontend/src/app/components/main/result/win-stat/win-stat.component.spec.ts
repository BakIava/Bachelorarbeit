import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinStatComponent } from './win-stat.component';

describe('WinStatComponent', () => {
  let component: WinStatComponent;
  let fixture: ComponentFixture<WinStatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WinStatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WinStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
