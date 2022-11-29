import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sarsa-configuration',
  templateUrl: './sarsa-configuration.component.html',
  styleUrls: ['./sarsa-configuration.component.scss']
})
export class SarsaConfigurationComponent implements OnInit, OnDestroy {
  @Input() form!: FormGroup;

  constructor() { }

  ngOnDestroy(): void {
    this.form.removeControl('Epsilon');
    this.form.removeControl('Alpha');
    this.form.removeControl('Gamma');
    this.form.removeControl('Reward');
    this.form.removeControl('Random');
    this.form.removeControl('GoalReward');
  }

  ngOnInit(): void {
    this.form.addControl('Epsilon', new FormControl(0.1, Validators.required));
    this.form.addControl('Alpha', new FormControl(0.5, Validators.required));
    this.form.addControl('Gamma', new FormControl(0.99, Validators.required));
    this.form.addControl('Reward', new FormControl(-0.01, Validators.required));
    this.form.addControl('Random', new FormControl(false, Validators.required));
    this.form.addControl('GoalReward', new FormControl(1, Validators.required));
  }
}
