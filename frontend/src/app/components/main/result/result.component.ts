import { Component, Input, OnInit } from '@angular/core';
import { IScore } from 'src/app/model/IScore';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  @Input() firstPlayer: any;
  @Input() secondPlayer: any;
  @Input() score!: IScore;
  public chart: any;

  constructor() { }

  ngOnInit(): void {
    this.drawWinrate();
  }

  drawWinrate() {
    const labels = [];
    const p1 = [];
    const p2 = [];

    const cumulativeScore = { p1: 0, p2: 0 };
    for (let i = 1; i <= this.score.history.score.length; i++) {
      labels.push(i);
      if (this.score.history.score[i] === 1) cumulativeScore.p1++;
      else cumulativeScore.p2++;
      // debugger;
      p1.push(cumulativeScore.p1 / i * 100);
      p2.push(cumulativeScore.p2 / i * 100);
    }
    this.chart = new Chart("Winrate", {
      type: 'line', //this denotes tha type of chart
      data: {// values on X-Axis
        labels: labels,
        datasets: [
          {
            label: this.firstPlayer['Name'].value,
            data: p1,
            backgroundColor: 'red',
            borderColor: 'red',
            borderWidth: 1,
            pointRadius: 0,
            fill: true
          },
          {
            label: this.secondPlayer['Name'].value,
            data: p2,
            backgroundColor: 'blue',
            borderColor: 'blue',
            borderWidth: 1,
            pointRadius: 0,
            fill: true
          }
        ]
      },
      options: {
        plugins: {
          filler: {
            propagate: false,
            drawTime: 'beforeDatasetsDraw'
          },
          title: {
            display: true,
            text: 'Winrate progression'
          }
        },
        scales: {
          x: {
            type: 'linear'
          }
        },
        backgroundColor: '#fff',
        interaction: {
          intersect: false,
        }
      }
    });
  }
}
