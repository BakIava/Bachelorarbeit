import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { QValue } from '../../mola-rotunda/mola-rotunda.component';

@Component({
  selector: 'app-select-versus',
  templateUrl: './select-versus.component.html',
  styleUrls: ['./select-versus.component.scss']
})
export class SelectVersusComponent implements OnInit {
  selectableQValues?: {
    value: QValue[] | null,
    view: string
  }[];
  selectedQ: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.selectableQValues = [
      { value: this.data.q?.p1 as QValue[] | null, view: this.data.firstPlayerName },
      { value: this.data.q?.p2 as QValue[] | null, view: this.data.secondPlayerName },
    ];  
  }
}
