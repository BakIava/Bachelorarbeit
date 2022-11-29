import { Component, Input, OnInit } from '@angular/core';
import { IStatistic } from 'src/app/model/IStatistic';

@Component({
  selector: 'app-win-stat',
  templateUrl: './win-stat.component.html',
  styleUrls: ['./win-stat.component.scss']
})
export class WinStatComponent implements OnInit {
  @Input() firstPlayerName!: string;
  @Input() secondPlayerName!: string;
  @Input() statistic!: IStatistic;

  constructor() { }

  ngOnInit(): void {
  }

}
