import { FieldType } from "./model/FieldType";
import { GameState } from "./model/GameState";
import { BasePlayer } from "./player/base-player";
import { IStone } from "./model/IStone";
import { Action } from "./model/Action";
import { Position } from "./model/IPosition";

export class Game {
    private p1!: BasePlayer;
    private p2!: BasePlayer;
    private state!: GameState;

    private turn!: BasePlayer;
    private turnCount!: number;
    private winner?: { player: BasePlayer, state: GameState };
    private field!: FieldType[][];
    private middlePlaceAllowed!: boolean;

    private callback: Function | null = null;

    get GameIsStillRunning(): boolean { return this.state === GameState.PLACE_PHASE || this.state === GameState.MOVE_PHASE }
    get PlayerTurn(): BasePlayer { return this.turn; }
    get FirstPlayer(): BasePlayer { return this.p1; }
    get SecondPlayer(): BasePlayer { return this.p2; }
    get GameTurnCount(): number { return this.turnCount; }
    get GameState(): GameState { return this.state; }
    get GameField(): FieldType[][] { return this.field; }
    get GameWinner(): { player: BasePlayer, state: GameState } | undefined { return this.winner; }

    constructor(p1: BasePlayer, p2: BasePlayer, allowPlaceMiddle: boolean) {
        this.field = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];

        this.p1 = p1;
        this.p2 = p2;
        this.state = GameState.PLACE_PHASE;
        this.turn = this.p1;
        this.turnCount = 0;
        this.winner = undefined;
        this.middlePlaceAllowed = allowPlaceMiddle;
    }

    #checkIfWon(player: BasePlayer) {
        return this.field[0][0]?.player === player && this.field[1][1]?.player === player && this.field[2][2]?.player === player ||
            this.field[0][1]?.player === player && this.field[1][1]?.player === player && this.field[2][1]?.player === player ||
            this.field[0][2]?.player === player && this.field[1][1]?.player === player && this.field[2][0]?.player === player ||
            this.field[1][0]?.player === player && this.field[1][1]?.player === player && this.field[1][2]?.player === player
    }


    #endGame(p: BasePlayer) {
        if (p === this.p1) { this.p1.won(); }
        if (p === this.p2) { this.p2.won(); }
        this.winner = {
            player: p,
            state: this.state === GameState.PLACE_PHASE ? GameState.PLACE_PHASE : GameState.MOVE_PHASE
        };

        this.state = GameState.END;
    }

    #getPosOfStone(stone: IStone): Position | undefined {
        for (let i = 0; i < this.field.length; i++) {
            for (let j = 0; j < this.field[i].length; j++) {
                if (this.field[i][j] === stone) return { row: i, col: j };
            }
        }
    }

    #getNewPosOfStone(action: Action, stone: IStone) {
        const pos = this.#getPosOfStone(stone);
        if (!pos) throw new Error("Could not find stone.");

        const { row, col } = pos;
        if (action === Action.Right) return { row: row, col: col + 1 };
        if (action === Action.Left) return { row: row, col: col - 1 };
        if (action === Action.Up) return { row: row - 1, col: col };
        if (action === Action.Down) return { row: row + 1, col: col };
        if (action === Action.UpRight) return { row: row - 1, col: col + 1 };
        if (action === Action.UpLeft) return { row: row - 1, col: col - 1 };
        if (action === Action.DownRight) return { row: row + 1, col: col + 1 };
        if (action === Action.DownLeft) return { row: row + 1, col: col - 1 };
    }

    #checkIfMoveIsPossible(action: number, stone: IStone) {
        const pos = this.#getPosOfStone(stone);
        if (!pos) throw new Error("Could not find stone.");

        const { row, col } = pos;

        if (action === Action.Right && col !== 2 && this.field[row][col + 1] === null) return true;
        if (action === Action.Left && col !== 0 && this.field[row][col - 1] === null) return true;
        if (action === Action.Up && row !== 0 && this.field[row - 1][col] === null) return true;
        if (action === Action.Down && row !== 2 && this.field[row + 1][col] === null) return true;
        if (action === Action.UpRight && ((col === 0 && row === 2) || (col === 1 && row === 1)) && this.field[row - 1][col + 1] === null) return true;
        if (action === Action.UpLeft && ((col === 2 && row === 2) || (col === 1 && row === 1)) && this.field[row - 1][col - 1] === null) return true;
        if (action === Action.DownRight && ((col === 0 && row === 0) || (col === 1 && row === 1)) && this.field[row + 1][col + 1] === null) return true;
        if (action === Action.DownLeft && ((col === 2 && row === 0) || (col === 1 && row === 1)) && this.field[row + 1][col - 1] === null) return true;

        return false;
    }

    #moveStone(newPos: Position, stone: IStone) {
        const pos = this.#getPosOfStone(stone);
        if (!pos) throw new Error("Could not find stone.");

        const { row, col } = pos;

        this.field[row][col] = null;
        this.field[newPos.row][newPos.col] = stone;
    }

    resetGame() {
        this.field = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];

        // this.turn = this.GameWinner?.player === this.p1 ? this.p1 : this.p2;
        this.state = GameState.PLACE_PHASE;
        this.winner = undefined;
        this.turnCount = 0;
        this.p1.resetStones();
        this.p2.resetStones();
    }

    placeStone(pos: Position, stone: IStone, callback: Function | null) {
        if (this.state !== GameState.PLACE_PHASE) return false;
        if (this.field[pos.row][pos.col] !== null) return false;
        if (stone.player !== this.turn) return false;
        if (!this.middlePlaceAllowed && pos.row === 1 && pos.col === 1) return false;

        this.field[pos.row][pos.col] = stone;

        stone.player.placeStone();

        this.turnCount++;

        if (this.callback) { this.callback(); this.callback = null; }
        if (callback) this.callback = callback;

        if (this.#checkIfWon(stone.player)) {
            this.#endGame(stone.player);
            return true;
        }

        if (stone.player === this.p1) this.turn = this.p2
        else this.turn = this.p1;

        if (this.p1.StonesLeft === 0 && this.p2.StonesLeft === 0) this.state = GameState.MOVE_PHASE;

        return true;
    }

    moveStone(action: number, stone: IStone, callback: Function | null) {
        if (this.state !== GameState.MOVE_PHASE) return false;
        if (stone.player !== this.turn) return false;
        if (!this.#checkIfMoveIsPossible(action, stone)) return false;

        const pos = this.#getNewPosOfStone(action, stone);
        if (!pos) throw new Error("Could not find stone.");

        const { row, col } = pos;

        this.turnCount++;

        this.#moveStone({ row, col }, stone);

        if (this.callback) { this.callback(); this.callback = null; }
        if (callback) this.callback = callback;

        if (this.#checkIfWon(stone.player)) {
            this.#endGame(stone.player);
            return true;
        }

        if (stone.player === this.p1) this.turn = this.p2
        else this.turn = this.p1;

        return true;
    }

    takeTurn() {
        let turnCompleted = false;
        do {
            if (this.state === GameState.PLACE_PHASE) {
                const { row, col, callback } = this.turn.choosePlaceAction(this.field);
                turnCompleted = this.placeStone({ row, col }, { player: this.turn }, callback);
                // if (callback) callback();
            } else if (this.state === GameState.MOVE_PHASE) {
                const { action, stone, callback } = this.turn.chooseMoveAction(this.field);
                turnCompleted = this.moveStone(action, stone, callback);
                // if (callback) callback();
            }

            // Logs every successfull move
            // if (turnCompleted) printField(g.GameField);
        }
        while (!turnCompleted)
    }
}