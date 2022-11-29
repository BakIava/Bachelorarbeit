import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RetrainPuppetComponent } from './retrain-puppet/retrain-puppet.component';

@Component({
  selector: 'app-sarsa-training-puppet-configuration',
  templateUrl: './sarsa-training-puppet-configuration.component.html',
  styleUrls: ['./sarsa-training-puppet-configuration.component.scss']
})
export class SarsaTrainingPuppetConfigurationComponent implements OnInit {
  @Input() form!: FormGroup;

  constructor(private dialog: MatDialog) { }

  ngOnDestroy(): void {
    this.form.removeControl('Epsilon');
  }

  ngOnInit(): void {
    this.form.addControl('Epsilon', new FormControl(0.1, Validators.required));
  }

  retrain() {
    this.dialog.open(RetrainPuppetComponent)
  }
}
