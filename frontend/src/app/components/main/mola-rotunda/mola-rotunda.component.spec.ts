import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MolaRotundaComponent } from './mola-rotunda.component';

describe('MolaRotundaComponent', () => {
  let component: MolaRotundaComponent;
  let fixture: ComponentFixture<MolaRotundaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MolaRotundaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MolaRotundaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
