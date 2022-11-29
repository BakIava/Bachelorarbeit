import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { Action } from './model/Action';
import { Game } from './model/Game';
import { GameState } from './model/GameState';
import { WinnerComponent } from './winner/winner.component';

async function load() {
  const timer = (ms: number) => new Promise(res => setTimeout(res, ms))
  await timer(2000);
}

@Component({
  selector: 'app-versus',
  templateUrl: './versus.component.html',
  styleUrls: ['./versus.component.scss']
})
export class VersusComponent implements OnInit {
  game!: Game;

  userSelected: boolean = false;
  userPos: number | null = null;
  userAction: number | null = null;
  userTurn: boolean = false;
  startPlayer: '1' | '2' = '1';

  possibleMoves: { id: number; moves: { label: string, icon: string, action: number }[] }[] = [
    { id: 0, moves: [] },
    { id: 1, moves: [] },
    { id: 2, moves: [] },
    { id: 3, moves: [] },
    { id: 4, moves: [] },
    { id: 5, moves: [] },
    { id: 6, moves: [] },
    { id: 7, moves: [] },
    { id: 8, moves: [] },
  ]

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private sb: SnackbarService) { }

  ngOnInit(): void {
    this.game = new Game(this.data.q, this.startPlayer, this.data.allowPlaceMiddle);
  }

  moveForField(id: number) {
    return this.possibleMoves.find(m => m.id === id)!.moves;
  }

  checkForMoves() {
    // clear
    this.possibleMoves.forEach((m) => m.moves = []);

    let state = '';
    this.game.field.forEach((f) => state += f.player);
    let splittedField = [['', '', ''], ['', '', ''], ['', '', '']];
    let splittedState = state.match(/.{1,3}/g) as string[];
    for (let i = 0; i < splittedState.length; i++) {
      let splittedRow = splittedState[i].match(/.{1,1}/g) as string[];
      for (let j = 0; j < splittedRow.length; j++) {
        splittedField[i][j] = splittedRow[j];
      }
    }

    for (const move of this.possibleMoves) {
      let row = Math.floor(move.id / 3);
      let col = move.id % 3;

      if (col !== 2 && splittedField[row][col + 1] === '0') move.moves.push({ label: 'Right', icon: 'east', action: Action.Right });
      if (col !== 0 && splittedField[row][col - 1] === '0') move.moves.push({ label: 'Left', icon: 'west', action: Action.Left });
      if (row !== 0 && splittedField[row - 1][col] === '0') move.moves.push({ label: 'Up', icon: 'north', action: Action.Up });
      if (row !== 2 && splittedField[row + 1][col] === '0') move.moves.push({ label: 'Down', icon: 'south', action: Action.Down });
      if (((row === 2 && col === 0) || (col === 1 && row === 1)) && splittedField[row - 1][col + 1] === '0') move.moves.push({ label: 'UpRight', icon: 'north_east', action: Action.UpRight });
      if (((row === 2 && col === 2) || (col === 1 && row === 1)) && splittedField[row - 1][col - 1] === '0') move.moves.push({ label: 'UpLeft', icon: 'north_west', action: Action.UpLeft });
      if (((row === 0 && col === 0) || (col === 1 && row === 1)) && splittedField[row + 1][col + 1] === '0') move.moves.push({ label: 'DownRight', icon: 'south_east', action: Action.DownRight });
      if (((row === 0 && col === 2) || (col === 1 && row === 1)) && splittedField[row + 1][col - 1] === '0') move.moves.push({ label: 'DownLeft', icon: 'south_west', action: Action.DownLeft });
    }
  }

  convertField() {
    let convertedField = '';
    this.game.field.forEach((f) => convertedField += f.player);
    return convertedField;
  }

  async startGame() {
    this.game = new Game(this.data.q, this.startPlayer, this.data.allowPlaceMiddle);
    while (this.game.GameIsStillRunning) {
      if (this.game.turn === this.data.player) {
        // Algorithm takes turn
        if (this.game.state === GameState.PLACE_PHASE) {
          const action = this.game.algoritm.choosePlaceAction(this.convertField());
          this.game.placeStone(action, this.data.player);
        }

        if (this.game.state === GameState.MOVE_PHASE) {
          const action = this.game.algoritm.chooseMoveAction(this.convertField());
          this.game.moveStone(action.action, (action.row * 3 + action.col), this.data.player);

          this.checkForMoves();
        }
      } else {
        // User needs to select
        this.userTurn = true;
        while (!this.userSelected) { await load(); }

        if (this.game.state === GameState.PLACE_PHASE) {
          const result = this.game.placeStone(this.userAction as number, this.data.player === '1' ? '2' : '1');
          this.userSelected = false;

          if (!result) this.sb.open('Illegal move', SnackbarService.Level.ERROR);
        }

        if (this.game.state === GameState.MOVE_PHASE) {
          this.game.moveStone(this.userAction as number, this.userPos as number, this.data.player === '1' ? '2' : '1');
          this.userSelected = false;
        }
      }
    }

    if (this.game.winner === this.data.player) {
      this.dialog.open(WinnerComponent, {
        data: 'Algorithm won!'
      });
    } else {
      this.dialog.open(WinnerComponent, {
        data: 'You won!'
      });
    }

    this.startPlayer = this.startPlayer === '1' ? '2' : '1';
  }

  placeStone(id: number) {
    this.userAction = id;
    this.userSelected = true;
    this.userTurn = false;
  }

  moveStone(id: number, action: number) {
    this.userPos = id;
    this.userAction = action;
    this.userSelected = true;
    this.userTurn = false;
  }
}
