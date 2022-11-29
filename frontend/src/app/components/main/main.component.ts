import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IScore } from 'src/app/model/IScore';
import { ApiService } from 'src/app/services/api/api.service';
import { ResultComponent } from 'src/app/components/main/result/result.component';
import { MatDialog } from '@angular/material/dialog';
import { VersusComponent } from './versus/versus.component';
import { firstValueFrom } from 'rxjs';
import { IStatistic } from 'src/app/model/IStatistic';
import { SelectVersusComponent } from './versus/select-versus/select-versus.component';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  loading: boolean = false;
  started: boolean = false;
  score: IScore = { player1: 0, player2: 0, history: { score: [], move: [] } };
  statistic!: IStatistic;
  q!: {
    p1: any,
    p2: any
  };

  @ViewChild(ResultComponent) result!: ResultComponent;

  firstPlayerConfigurationGroup: FormGroup = new FormGroup({});
  secondPlayerConfigurationGroup: FormGroup = new FormGroup({});

  firstPlayerGroup: FormGroup = new FormGroup({
    "Player": new FormControl('', Validators.required),
    "Name": new FormControl('Player 1', Validators.required),
    "Configuration": this.firstPlayerConfigurationGroup
  });

  secondPlayerGroup: FormGroup = new FormGroup({
    "Player": new FormControl('', Validators.required),
    "Name": new FormControl('Player 2', Validators.required),
    "Configuration": this.secondPlayerConfigurationGroup
  });

  additionalOptionGroup: FormGroup = new FormGroup({
    "Episodes": new FormControl('', Validators.required),
    "AllowPlaceMiddle": new FormControl(false, Validators.required)
  })

  playerTypes = [
    { id: 0, display: 'SARSA Algorithm' },
    { id: 1, display: 'SARSA Training Puppet - Easy' },
    { id: 2, display: 'SARSA Training Puppet - Medium' },
    { id: 3, display: 'SARSA Training Puppet - Hard' },
    { id: 4, display: 'Random moves' },
  ]

  get firstPlayer() { return this.firstPlayerGroup.controls; }
  get secondPlayer() { return this.secondPlayerGroup.controls; }
  get additionalOption() { return this.additionalOptionGroup.controls; }

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private sb: SnackbarService
  ) { }

  async start() {
    this.loading = true;
    this.started = false;
    const config = {
      p1: {
        name: this.firstPlayer['Name'].value,
        player: this.firstPlayer['Player'].value,
        configuration: this.firstPlayer['Configuration'].value
      },
      p2: {
        name: this.secondPlayer['Name'].value,
        player: this.secondPlayer['Player'].value,
        configuration: this.secondPlayer['Configuration'].value
      },
      options: {
        episodes: this.additionalOption['Episodes'].value,
        allowPlaceMiddle: this.additionalOption['AllowPlaceMiddle'].value,
      }
    }

    const result = await this.api.start(config).catch((e) => {
      this.loading = false;
      this.sb.open('Fatal Error', SnackbarService.Level.ERROR);
      throw e;
    });

    this.started = true;
    this.statistic = result.statistic;
    this.q = result.q;
    this.loading = false;
  }

  async versus() {
    const selectedQ = await firstValueFrom(this.dialog.open(SelectVersusComponent, {
      disableClose: true,
      data: {
        q: this.q,
        firstPlayerName: this.firstPlayer['Name'].value,
        secondPlayerName: this.secondPlayer['Name'].value
      }
    }).afterClosed());

    if (!selectedQ) return;

    const ref = this.dialog.open(VersusComponent, {
      disableClose: true,
      data: { q: selectedQ, allowPlaceMiddle: this.additionalOption['AllowPlaceMiddle'].value, player: selectedQ === this.q.p1 ? '1' : '2' }
    });

    await firstValueFrom(ref.afterClosed());
  }

  ngOnInit(): void {
    // this.loading = true;
    // this.api.getExample().then((ex) => {
    //   this.started = true;
    //   this.statistic = ex.statistic;
    //   this.q = ex.q;
    //   this.loading = false;
    // });
  }
}
