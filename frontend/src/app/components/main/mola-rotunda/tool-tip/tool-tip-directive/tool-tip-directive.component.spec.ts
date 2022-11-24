import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolTipDirectiveComponent } from './tool-tip-directive.component';

describe('ToolTipDirectiveComponent', () => {
  let component: ToolTipDirectiveComponent;
  let fixture: ComponentFixture<ToolTipDirectiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolTipDirectiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolTipDirectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
