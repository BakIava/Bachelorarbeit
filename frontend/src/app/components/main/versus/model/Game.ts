import { Action } from "./Action";
import { Algorithm } from "./Algorithm";
import { GameState } from "./GameState";
import { IVersusField } from "./IVersusField";

export class Game {
    state: GameState;
    turn: '1' | '2';
    winner?: '1' | '2';
    field: IVersusField[];
    algoritm: Algorithm;
    stones: { p1: number, p2: number };
    allowPlaceMiddle: boolean;

    get GameIsStillRunning(): boolean { return this.state === GameState.PLACE_PHASE || this.state === GameState.MOVE_PHASE }

    constructor(q: any, startPlayer: '1' | '2', allowPlaceMiddle: boolean) {
        this.state = GameState.PLACE_PHASE;
        this.turn = startPlayer;

        this.field = [
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

        this.algoritm = new Algorithm(q);
        this.stones = {
            p1: 3,
            p2: 3
        };

        this.allowPlaceMiddle = allowPlaceMiddle;
    }

    private endGame(player: '1' | '2') {
        this.state = GameState.END;
        this.winner = player;
    }

    private checkIfWon(player: '1' | '2'): boolean {
        if (this.field[4].player === player &&
            this.field[0].player === player &&
            this.field[8].player === player) return true;

        if (this.field[4].player === player &&
            this.field[1].player === player &&
            this.field[7].player === player) return true;

        if (this.field[4].player === player &&
            this.field[2].player === player &&
            this.field[6].player === player) return true;

        if (this.field[4].player === player &&
            this.field[3].player === player &&
            this.field[5].player === player) return true;

        return false;
    }

    placeStone(pos: number, player: '1' | '2') {
        if (this.state !== GameState.PLACE_PHASE) return false;
        if (this.field[pos].player !== '0') return false;
        if (player !== this.turn) return false;
        if (!this.allowPlaceMiddle && pos === 4) return false;

        this.field[pos].player = player;

        if (this.checkIfWon(player)) {
            this.endGame(player);
            return true;
        }

        if (player === '1') {
            this.turn = '2';
            this.stones.p1--;
        }
        else {
            this.turn = '1'
            this.stones.p2--;
        };

        if (this.stones.p1 === 0 && this.stones.p2 === 0) this.state = GameState.MOVE_PHASE;

        return true;
    }

    moveStone(action: number, pos: number, player: '1' | '2') {
        if (this.state !== GameState.MOVE_PHASE) return false;
        if (player !== this.turn) return false;
        // Check if possible is removed

        let row = Math.floor(pos / 3);
        let col = pos % 3;
        let state = '';
        this.field.forEach((f) => state += f.player);
        let splittedField = [['', '', ''], ['', '', ''], ['', '', '']]
        let splittedState = state.match(/.{1,3}/g) as string[];
        for (let i = 0; i < splittedState.length; i++) {
            let splittedRow = splittedState[i].match(/.{1,1}/g) as string[];
            for (let j = 0; j < splittedRow.length; j++) {
                splittedField[i][j] = splittedRow[j];
            }
        }

        let newPos = { row: 0, col: 0 };
        if (action === Action.Right) newPos = { row: row, col: col + 1 };
        if (action === Action.Left) newPos = { row: row, col: col - 1 };
        if (action === Action.Up) newPos = { row: row - 1, col: col };
        if (action === Action.Down) newPos = { row: row + 1, col: col };
        if (action === Action.UpRight) newPos = { row: row - 1, col: col + 1 };
        if (action === Action.UpLeft) newPos = { row: row - 1, col: col - 1 };
        if (action === Action.DownRight) newPos = { row: row + 1, col: col + 1 };
        if (action === Action.DownLeft) newPos = { row: row + 1, col: col - 1 };

        splittedField[row][col] = '0';
        splittedField[newPos.row][newPos.col] = player;

        this.field[0].player = splittedField[0][0];
        this.field[1].player = splittedField[0][1];
        this.field[2].player = splittedField[0][2];
        this.field[3].player = splittedField[1][0];
        this.field[4].player = splittedField[1][1];
        this.field[5].player = splittedField[1][2];
        this.field[6].player = splittedField[2][0];
        this.field[7].player = splittedField[2][1];
        this.field[8].player = splittedField[2][2];

        if (this.checkIfWon(player)) {
            this.endGame(player);
            return true;
        }

        if (player === '1') this.turn = '2'
        else this.turn = '1';

        return true;
    }
}