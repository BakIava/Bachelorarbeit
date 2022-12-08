import { Component, Input, OnInit } from '@angular/core';
import { IScore } from 'src/app/model/IScore';
import { Chart, registerables } from 'chart.js';
import { IStatistic } from 'src/app/model/IStatistic';
Chart.register(...registerables);

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  @Input() firstPlayerName!: string;
  @Input() secondPlayerName!: string;
  @Input() statistic!: IStatistic;

  public WinrateChart: any;
  public TurnsChart: any;

  constructor() { }

  ngOnInit(): void {
    this.drawWinrate();
    this.drawTurn();
  }

  drawWinrate() {
    const labels = [];
    const p1 = [];
    const p2 = [];

    const cumulativeScore = { p1: 0, p2: 0 };
    for (let i = 1; i <= this.statistic.score.history.length; i++) {
      labels.push(i);
      if (this.statistic.score.history[i] === 1) cumulativeScore.p1++;
      else cumulativeScore.p2++;
      // debugger;
      p1.push(cumulativeScore.p1 / i * 100);
      p2.push(cumulativeScore.p2 / i * 100);
    }

    this.WinrateChart = new Chart("WinrateChart", {
      type: 'line', //this denotes tha type of chart
      data: {// values on X-Axis
        labels: labels,
        datasets: [
          {
            label: this.firstPlayerName,
            data: p1,
            backgroundColor: 'red',
            borderColor: 'red',
            borderWidth: 1,
            pointRadius: 0,
            // fill: true
          },
          {
            label: this.secondPlayerName,
            data: p2,
            backgroundColor: 'blue',
            borderColor: 'blue',
            borderWidth: 1,
            pointRadius: 0,
            // fill: true
          }
        ]
      },
      options: {
        spanGaps: true,
        animation: false,
        plugins: {
          legend: {
            labels: {
              font: {
                size: 22
              }
            }
          },
          filler: {
            propagate: false,
            drawTime: 'beforeDatasetsDraw'
          },
          title: {
            display: true,
            text: 'Winrate progression',
            font: {
              size: 26
            }
          },
        },
        scales: {
          x: {
            type: 'linear',
            ticks: {
              font: {
                size: 22
              },
              count: 21
            }
          },
          y: {
            ticks: {
              font: {
                size: 22
              },
              count: 21
            }
          }
        },
        backgroundColor: '#fff',
        interaction: {
          intersect: false,
        }
      }
    });
  }

  drawTurn() {
    const labels = [];
    let turns = new Map<number, number>()

    for (const turn of this.statistic.score.turn) {
      if (turns.has(turn)) {
        turns.set(turn, (turns.get(turn) as number) + 1);
      } else turns.set(turn, 1);
    }

    turns = new Map([...turns].sort((a, b) => { return a[0] - b[0] }));

    this.WinrateChart = new Chart("TurnsChart", {
      type: 'bar', //this denotes tha type of chart
      data: {// values on X-Axis
        labels: Array.from(turns.keys()),
        datasets: [
          {
            label: 'Turncount',
            data: Array.from(turns.values()),
            backgroundColor: 'black',
            borderColor: 'black',
            borderWidth: 1,
            // pointRadius: 0,
            // fill: true,
            // tension: 0.4
          }
        ]
      },
      options: {
        // spanGaps: true,
        animation: false,
        plugins: {
          legend: {
            labels: {
              font: {
                size: 22
              }
            }
          },
          title: {
            display: true,
            text: 'How many turns episodes took',
            font: {
              size: 26
            }
          },
        },
        scales: {
          x: {
            title: {
              text: 'Turns',
              display: true,
              font: {
                size: 22
              }
            },
            ticks: {
              font: {
                size: 18
              }
            },
            // type: 'linear',
            min: Array.from(turns.keys())[0],
            max: Array.from(turns.keys())[Array.from(turns.keys()).length - 1],
          },
          y: {
            title: {
              text: 'Count',
              display: true,
              font: {
                size: 22
              }
            },
            ticks: {
              font: {
                size: 22
              }
            }
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
