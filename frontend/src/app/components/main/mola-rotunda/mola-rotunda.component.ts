import { Component, OnInit, Input } from '@angular/core';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';

export interface IField {
  id: number,
  className: string,
  player: '0' | '1' | '2';
  heat?: string;
  highestValue: number;
  value: number;
}

export interface QValue {
  state: string;
  actionValue: {
    action: number | {
      action: number;
      row: number;
      col: number;
    };
    value: number;
  }[];
}

@Component({
  selector: 'app-mola-rotunda',
  templateUrl: './mola-rotunda.component.html',
  styleUrls: ['./mola-rotunda.component.scss']
})
export class MolaRotundaComponent implements OnInit {
  @Input() q!: QValue[];
  @Input() move!: any[];
  editMode: boolean = true;
  stones = {
    p1: 3,
    p2: 3
  }

  fields: IField[] = [
    { id: 0, className: 'top-left', player: '0', highestValue: 0, value: 0 },
    { id: 1, className: 'top', player: '0', highestValue: 0, value: 0 },
    { id: 2, className: 'top-right', player: '0', highestValue: 0, value: 0 },

    { id: 3, className: 'middle-left', player: '0', highestValue: 0, value: 0 },
    { id: 4, className: 'middle', player: '0', highestValue: 0, value: 0 },
    { id: 5, className: 'middle-right', player: '0', highestValue: 0, value: 0 },

    { id: 6, className: 'bottom-left', player: '0', highestValue: 0, value: 0 },
    { id: 7, className: 'bottom', player: '0', highestValue: 0, value: 0 },
    { id: 8, className: 'bottom-right', player: '0', highestValue: 0, value: 0 }
  ]

  constructor(private sb: SnackbarService) { }

  ngOnInit(): void { }

  checkIfPossible(): boolean {
    if (this.stones.p1 < this.stones.p2) return false;
    if (this.stones.p2 - this.stones.p1 < -1) return false;
    return true;
  }

  clearValuesFromField() { this.fields.forEach((field) => { field.value = 0; field.highestValue = 0; field.heat = 'rgb(255, 255, 255, 0)' }); }

  getState(): string {
    let state = '';
    this.fields.forEach((field) => state += field.player);
    return state;
  }

  applyInformations() {
    if (!this.checkIfPossible()) {
      this.sb.open('Please select valid state.', SnackbarService.Level.WARN);
      return;
    }

    this.clearValuesFromField();
    const state = this.getState();
    const value = this.q.find(value => value.state === state);
    if (!value) return;
    for (const action of value.actionValue) {
      const red = action.value < 0 ? 255 : 255 * (1 - action.value);
      const green = action.value > 0 ? 255 : 255 * (1 + action.value);

      let index = typeof action.action === 'number' ? action.action : action.action.row * 3 + action.action.col;

      if (action.value > this.fields[index].highestValue) {
        this.fields[index].highestValue = action.value;
        this.fields[index].heat = `rgb(${red}, ${green}, 0)`;
      }

      this.fields[index].highestValue = action.value;
      this.fields[index].heat = `rgb(${red}, ${green}, 0)`;
    }

    this.editMode = false;
  }

  selectState() {
    this.editMode = true;
    this.clearValuesFromField();
  }

  placeStone(position: number, player: '0' | '1' | '2') {
    if (player === '1' && this.stones.p1 <= 0) return;
    if (player === '2' && this.stones.p2 <= 0) return;


    if (this.fields[position].player !== '0') {
      if (this.fields[position].player === '1') this.stones.p1++;
      if (this.fields[position].player === '2') this.stones.p2++;
    }

    if (player === '1') this.stones.p1--;
    if (player === '2') this.stones.p2--;

    this.fields[position].player = player;
  }
}
