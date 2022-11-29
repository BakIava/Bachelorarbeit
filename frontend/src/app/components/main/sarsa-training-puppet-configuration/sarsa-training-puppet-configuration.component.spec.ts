import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SarsaTrainingPuppetConfigurationComponent } from './sarsa-training-puppet-configuration.component';

describe('SarsaTrainingPuppetConfigurationComponent', () => {
  let component: SarsaTrainingPuppetConfigurationComponent;
  let fixture: ComponentFixture<SarsaTrainingPuppetConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SarsaTrainingPuppetConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SarsaTrainingPuppetConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
