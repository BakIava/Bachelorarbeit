import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';

@Component({
  selector: 'app-retrain-puppet',
  templateUrl: './retrain-puppet.component.html',
  styleUrls: ['./retrain-puppet.component.scss']
})
export class RetrainPuppetComponent implements OnInit {
  loading: boolean = false;
  form: FormGroup = new FormGroup({
    'Puppet': new FormControl('', Validators.required),
    'Epsilon': new FormControl(0.1, Validators.required),
    'Alpha': new FormControl(0.5, Validators.required),
    'Gamma': new FormControl(0.99, Validators.required),
    'Reward': new FormControl(-0.01, Validators.required),
    'GoalReward': new FormControl(1, Validators.required),
    'Episodes': new FormControl('', Validators.required),
    'Random': new FormControl(false, Validators.required),
    'AllowPlaceMiddle': new FormControl(false, Validators.required)
  });

  puppetTypes = [
    { id: 1, display: 'SARSA Training Puppet - Easy' },
    { id: 2, display: 'SARSA Training Puppet - Medium' },
    { id: 3, display: 'SARSA Training Puppet - Hard' },
  ]

  get f() { return this.form.controls; }

  constructor(private api: ApiService,
    public dialogRef: MatDialogRef<RetrainPuppetComponent>,
    private sb: SnackbarService
  ) { }

  ngOnInit(): void {
  }

  async retrain() {
    this.form.disable()
    this.loading = true;

    const config = {
      Puppet: this.f['Puppet'].value,
      Epsilon: this.f['Epsilon'].value,
      Alpha: this.f['Alpha'].value,
      Gamma: this.f['Gamma'].value,
      Reward: this.f['Reward'].value,
      GoalReward: this.f['GoalReward'].value,
      Episodes: this.f['Episodes'].value,
      Random: this.f['Random'].value,
      AllowPlaceMiddle: this.f['AllowPlaceMiddle'].value
    }

    await this.api.retrain(config).catch((e) => {
      this.sb.open('Error occured!', SnackbarService.Level.ERROR);
      console.error(e);      
      this.loading = false;
      this.form.enable();
      throw e;
    });
    this.sb.open('Puppet successfully retrained!', SnackbarService.Level.SUCCESS);
    this.dialogRef.close();
  }
}
