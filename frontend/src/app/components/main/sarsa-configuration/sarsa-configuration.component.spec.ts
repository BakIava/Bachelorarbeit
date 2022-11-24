import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SarsaConfigurationComponent } from './sarsa-configuration.component';

describe('SarsaConfigurationComponent', () => {
  let component: SarsaConfigurationComponent;
  let fixture: ComponentFixture<SarsaConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SarsaConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SarsaConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
