import { Component, OnInit, Input } from '@angular/core';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';

export interface IField {
  id: number,
  className: string,
  player: '0' | '1' | '2';
  heat?: string;
  highestValue?: number;
  value?: number;
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
  @Input() q!: {
    p1?: QValue[],
    p2?: QValue[]
  };
  @Input() move!: any;
  @Input() firstPlayerName!: string;
  @Input() secondPlayerName!: string;


  editMode: boolean = true;
  stones = {
    p1: 3,
    p2: 3
  }

  selectableQValues?: {
    value: {
      q: QValue[] | null,
      move: any
    },
    view: string
  }[];

  selected?: {
    q: QValue[],
    move: any
  };

  fields: IField[] = [
    { id: 0, className: 'top-left', player: '0' },
    { id: 1, className: 'top', player: '0' },
    { id: 2, className: 'top-right', player: '0' },

    { id: 3, className: 'middle-left', player: '0' },
    { id: 4, className: 'middle', player: '0' },
    { id: 5, className: 'middle-right', player: '0' },

    { id: 6, className: 'bottom-left', player: '0' },
    { id: 7, className: 'bottom', player: '0' },
    { id: 8, className: 'bottom-right', player: '0' }
  ]

  constructor(private sb: SnackbarService) { }

  ngOnInit(): void {
    this.selectableQValues = [
      { value: { q: this.q?.p1 as QValue[] | null, move: this.move?.p1Moves }, view: this.firstPlayerName },
      { value: { q: this.q?.p2 as QValue[] | null, move: this.move?.p2Moves }, view: this.secondPlayerName },
    ];
  }

  checkIfPossible(): boolean {
    if (this.selected?.q === this.q.p1) {
      if (this.stones.p1 < this.stones.p2) return false;
      if (this.stones.p2 - this.stones.p1 < -1) return false;
    } else if (this.selected?.q === this.q.p2) {
      if (this.stones.p1 > this.stones.p2) return false;
      if (this.stones.p1 - this.stones.p2 < -1) return false;
    }

    return true;
  }

  clearValuesFromField() { this.fields.forEach((field) => { field.value = undefined; field.highestValue = undefined; field.heat = 'rgb(255, 255, 255, 0)' }); }

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
    const value = this.selected!.q!.find(value => value.state === state);
    if (!value) return;
    for (const action of value.actionValue) {
      let index = typeof action.action === 'number' ? action.action : action.action.row * 3 + action.action.col;

      this.fields[index].value = action.value;
      if (action.value > (this.fields[index].highestValue ?? Number.MIN_SAFE_INTEGER)) {
        this.fields[index].highestValue = action.value;
      }
    }

    for (const field of this.fields) {
      if (!field.highestValue) continue;

      const red = field.highestValue < 0 ? 255 : 255 * (1 - field.highestValue);
      const green = field.highestValue > 0 ? 255 : 255 * (1 + field.highestValue);
      field.heat = `rgb(${red}, ${green}, 0)`;
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
