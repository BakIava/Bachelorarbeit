import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectVersusComponent } from './select-versus.component';

describe('SelectVersusComponent', () => {
  let component: SelectVersusComponent;
  let fixture: ComponentFixture<SelectVersusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectVersusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectVersusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
