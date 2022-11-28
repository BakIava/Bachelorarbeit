import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IScore } from 'src/app/model/IScore';
import { ApiService } from 'src/app/services/api/api.service';
import { ResultComponent } from 'src/app/components/main/result/result.component';
import { MatDialog } from '@angular/material/dialog';
import { VersusComponent } from './versus/versus.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  loading: boolean = false;
  started: boolean = false;
  score: IScore = { player1: 0, player2: 0, history: { score: [], move: [] } };
  q: any;

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
    "Shells": new FormControl(1, Validators.required)
  })

  playerTypes = [
    { id: 0, display: 'SARSA Algorithm' },
    { id: 1, display: 'Random moves' },
  ]

  get firstPlayer() { return this.firstPlayerGroup.controls; }
  get secondPlayer() { return this.secondPlayerGroup.controls; }
  get additionalOption() { return this.additionalOptionGroup.controls; }

  constructor(
    private api: ApiService,
    private dialog: MatDialog
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
        shells: this.additionalOption['Shells'].value
      }
    }

    const result = await this.api.start(config).catch((e) => { this.loading = false; throw e; });
    this.started = true;
    this.score.player1 = result.score.p1;
    this.score.player2 = result.score.p2;
    this.score.history = result.history;
    this.q = result.q;
    this.loading = false;
  }

  async versus() {
    const ref = this.dialog.open(VersusComponent, {
      disableClose: true,
      data: this.q
    });

    await firstValueFrom(ref.afterClosed());
  }

  ngOnInit(): void {
    // this.loading = true;
    // this.api.getExample().then((ex) => {
    //   this.started = true;
    //   this.score.player1 = ex.score.p1;
    //   this.score.player2 = ex.score.p2;
    //   this.score.history = ex.history;
    //   this.q = ex.q;
    //   this.loading = false;
    // });
  }
}
