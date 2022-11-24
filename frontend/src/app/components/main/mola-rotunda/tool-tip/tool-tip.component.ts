import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-tool-tip',
  templateUrl: './tool-tip.component.html',
  styleUrls: ['./tool-tip.component.scss']
})
export class ToolTipComponent implements AfterViewInit {

  tooltip: any;
  left: number = 0;
  top: number = 0;

  // Place Values
  value: number = 0;
  count: number = 0;
  stateCount: number = 0;
  relativeCount: number = 0;

  // Move Values
  movedCount: number = 0;
  relativeMoves: number = 0;
  moveData: number[] = [];
  moveLabels: string[] = [];
  moveColors: string[] = [];
  min: number = 0;
  max: number = 0;

  actionLabels: string[] = ['Right', 'Left', 'Up', 'Down', 'UpRight', 'UpLeft', 'DownRight', 'DownLeft']

  public countChart: any;
  public movesChart: any;
  isMove: boolean = false;

  constructor() { }
  ngAfterViewInit(): void {
    this.displayCharts();
  }

  ngOnInit(): void {
    if (this.tooltip.state.match(/1|2/g)?.length === 6) this.isMove = true;
    this.processInformation();
  }

  getPlaceStateValue() {
    const action = this.tooltip.field;
    const state = this.tooltip.state;
    const QValueForState = this.tooltip.q.find((v: { state: any; }) => v.state === state);
    const ValueForField = QValueForState.actionValue.find((v: { action: any; }) => v.action === action).value;
    return ValueForField;
  }

  getVisitCount() {
    let stateCount = 0;
    let actionCount = 0;
    for (const move of this.tooltip.move) {
      if (move.state === this.tooltip.state) {
        stateCount++;
        if (move.action === this.tooltip.field) actionCount++;
      }
    }

    return { stateCount, actionCount };
  }

  processInformation() {
    if (this.isMove) {
      // Calculate how many times moved
      // debugger;
      const field = this.tooltip.field;
      const state = this.tooltip.state;
      const states = this.tooltip.move.filter((m: { state: any; }) => m.state === state);
      this.movedCount = states.filter((s: { action: { row: number; col: number; }; }) => s.action.row * 3 + s.action.col === field).length;
      this.relativeMoves = this.movedCount / states.length * 100;
      const QValueForState = this.tooltip.q.find((v: { state: any; }) => v.state === state);
      const QValueForField = QValueForState.actionValue.filter((v: { action: { row: number; col: number; }; }) => v.action.row * 3 + v.action.col === field);
      for (let i = 0; i < this.actionLabels.length; i++) {
        const value = QValueForField.find((v: { action: { action: number; row: number; col: number; }; }) => v.action.action === i);
        if(!value) continue;
        this.moveData.push(value.value);
        this.moveLabels.push(this.actionLabels[i]);
        const red = value.value < 0 ? 255 : 255 * (1 - value.value);
        const green = value.value > 0 ? 255 : 255 * (1 + value.value);
        this.moveColors.push(`rgb(${red}, ${green}, 0)`);

        if(value.value > this.max) this.max = value.value;
        if(value.value < this.min) this.min = value.value;
      }
    } else {
      this.value = this.getPlaceStateValue();
      const result = this.getVisitCount();
      this.count = result.actionCount;
      this.stateCount = result.stateCount;
      this.relativeCount = result.actionCount / result.stateCount * 100;
    }
  }

  displayCharts() {
    if (this.isMove) {
      console.log(this.moveData);
      setTimeout(() => {
        this.movesChart = new Chart('MoveChart' + this.tooltip.field, {
          type: 'polarArea', //this denotes tha type of chart
          data: {// values on X-Axis
            labels: this.moveLabels,
            datasets: [
              {
                label: 'Moved',
                data: this.moveData,
                backgroundColor: this.moveColors,
                borderColor: 'black'
              },
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Moves'
              }
            },
            scales: {
              r: {
                max: this.max + 0.5,
                min: this.min - 0.5,
                grid: {
                  color: 'white'
                }
              },
            }
          }
        });
      });

    } else {
      setTimeout(() => {
        this.countChart = new Chart('CountChart' + this.tooltip.field, {
          type: 'bar', //this denotes tha type of chart
          data: {// values on X-Axis
            labels: ['Place count'],
            datasets: [
              {
                label: 'Placed here',
                data: [this.count],
                backgroundColor: 'red',
                borderColor: 'red'
              },
              {
                label: 'Rest',
                data: [this.stateCount],
                backgroundColor: 'blue',
                borderColor: 'blue'
              }
            ]
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Places'
              }
            }
          }
        });
      })
    }
  }
}
