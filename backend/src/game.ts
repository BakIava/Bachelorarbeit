import { FieldType } from "./model/FieldType";
import { GameState } from "./model/GameState";
import { IStone } from "./model/IStone";
import { Action } from "./model/Action";
import { Position } from "./model/IPosition";
import { BasePlayer } from "./player/base-player";

export interface IPosition {
    shell?: number;
    point?: number;
    core?: boolean;
}

export interface IConnection {
    point?: number;
    shell?: number;
    action: number;
    core?: boolean;
}

export interface IShell {
    points: IPoint[];
}

export interface IPoint {
    pos: number;
    connections: IConnection[];
    fill: IStone | null;
}

export interface IField {
    core: IPoint;
    shells: IShell[];
}

export class Game {
    private readonly PointsPerShell = 8;

    private p1!: BasePlayer;
    private p2!: BasePlayer;
    private tie: number = 0;
    private state!: GameState;

    private turn!: BasePlayer;
    private winner?: BasePlayer | undefined;
    // private field!: FieldType[][];
    private field!: IField;
    private shellCount!: number;
    private placeCoreAllowed!: boolean;

    private callback: Function | null = null;

    get GameIsStillRunning(): boolean { return this.state === GameState.PLACE_PHASE || this.state === GameState.MOVE_PHASE }
    get PlayerTurn(): BasePlayer { return this.turn; }
    get FirstPlayer(): BasePlayer { return this.p1; }
    get SecondPlayer(): BasePlayer { return this.p2; }
    get GameState(): GameState { return this.state; }
    get GameField(): IField { return this.field; }
    get GameWinner(): BasePlayer | undefined { return this.winner; }
    get TieCount(): number { return this.tie; }

    constructor(p1: BasePlayer, p2: BasePlayer, shellCount: number, placeCoreAllowed: boolean) {
        this.placeCoreAllowed = placeCoreAllowed;
        this.shellCount = shellCount;
        this.initField();

        this.p1 = p1;
        this.p2 = p2;
        this.state = GameState.PLACE_PHASE;
        this.turn = this.p1;
        this.winner = undefined;
    }

    private initField() {
        this.field = {
            core: {
                pos: 0,
                connections: [],
                fill: null
            },
            shells: []
        }

        for (let i = 0; i < this.shellCount; i++) {
            const shell: IShell = { points: [] };
            for (let j = 0; j < this.PointsPerShell; j++) {
                shell.points.push({
                    pos: j, connections: [], fill: null
                });
            }
            this.field.shells.push(shell);
        }

        // Connect core with points
        this.field.core.connections.push({ shell: 0, point: 4, action: Action.Right });
        this.field.core.connections.push({ shell: 0, point: 5, action: Action.DownRight });
        this.field.core.connections.push({ shell: 0, point: 6, action: Action.Down });
        this.field.core.connections.push({ shell: 0, point: 7, action: Action.DownLeft });
        this.field.core.connections.push({ shell: 0, point: 0, action: Action.Left });
        this.field.core.connections.push({ shell: 0, point: 1, action: Action.UpLeft });
        this.field.core.connections.push({ shell: 0, point: 2, action: Action.Up });
        this.field.core.connections.push({ shell: 0, point: 3, action: Action.UpRight });

        // Connect point with eachother
        for (let i = 0; i < this.field.shells.length; i++) {
            for (let j = 0; j < this.field.shells[i].points.length; j++) {
                const point = this.field.shells[i].points[j];

                // Position = 0
                if (point.pos === 0) {
                    // Up
                    point.connections.push({ shell: i, point: 1, action: Action.Up });

                    // Right
                    if (i === 0) { // Means Shellno. 1
                        point.connections.push({ core: true, action: Action.Right });
                    }
                    else {
                        point.connections.push({ shell: i - 1, point: 0, action: Action.Right });
                    }

                    // Down
                    point.connections.push({ shell: i, point: 7, action: Action.Down });

                    // Left (only if not last shell)
                    if (i < this.field.shells.length - 1) {
                        point.connections.push({ shell: i + 1, point: 0, action: Action.Left });
                    }
                }

                if (point.pos === 1) {
                    // Right
                    point.connections.push({ shell: i, point: 2, action: Action.Right });

                    // DownRight
                    if (i === 0) { // Means Shellno. 1
                        point.connections.push({ core: true, action: Action.DownRight });
                    }
                    else {
                        point.connections.push({ shell: i - 1, point: 1, action: Action.DownRight });
                    }

                    // Down
                    point.connections.push({ shell: i, point: 0, action: Action.Down });

                    // UpLeft (only if not last shell)
                    if (i < this.field.shells.length - 1) {
                        point.connections.push({ shell: i + 1, point: 1, action: Action.UpLeft });
                    }
                }

                if (point.pos === 2) {
                    // Right
                    point.connections.push({ shell: i, point: 3, action: Action.Right });

                    // Down
                    if (i === 0) { // Means Shellno. 1
                        point.connections.push({ core: true, action: Action.Down });
                    }
                    else {
                        point.connections.push({ shell: i - 1, point: 2, action: Action.Down });
                    }

                    // Left
                    point.connections.push({ shell: i, point: 1, action: Action.Left });

                    // Up (only if not last shell)
                    if (i < this.field.shells.length - 1) {
                        point.connections.push({ shell: i + 1, point: 2, action: Action.Up });
                    }
                }

                if (point.pos === 3) {
                    // Down
                    point.connections.push({ shell: i, point: 4, action: Action.Down });

                    // DownLeft
                    if (i === 0) { // Means Shellno. 1
                        point.connections.push({ core: true, action: Action.DownLeft });
                    }
                    else {
                        point.connections.push({ shell: i - 1, point: 3, action: Action.DownLeft });
                    }

                    // Left
                    point.connections.push({ shell: i, point: 2, action: Action.Left });

                    // UpRight (only if not last shell)
                    if (i < this.field.shells.length - 1) {
                        point.connections.push({ shell: i + 1, point: 3, action: Action.UpRight });
                    }
                }

                if (point.pos === 4) {
                    // Down
                    point.connections.push({ shell: i, point: 5, action: Action.Down });

                    // Left
                    if (i === 0) { // Means Shellno. 1
                        point.connections.push({ core: true, action: Action.Left });
                    }
                    else {
                        point.connections.push({ shell: i - 1, point: 4, action: Action.Left });
                    }

                    // Up
                    point.connections.push({ shell: i, point: 3, action: Action.Up });

                    // Right (only if not last shell)
                    if (i < this.field.shells.length - 1) {
                        point.connections.push({ shell: i + 1, point: 4, action: Action.Right });
                    }
                }

                if (point.pos === 5) {
                    // Left
                    point.connections.push({ shell: i, point: 6, action: Action.Left });

                    // UpLeft
                    if (i === 0) { // Means Shellno. 1
                        point.connections.push({ core: true, action: Action.UpLeft });
                    }
                    else {
                        point.connections.push({ shell: i - 1, point: 5, action: Action.UpLeft });
                    }

                    // Up
                    point.connections.push({ shell: i, point: 4, action: Action.Up });

                    // DownRight (only if not last shell)
                    if (i < this.field.shells.length - 1) {
                        point.connections.push({ shell: i + 1, point: 5, action: Action.DownRight });
                    }
                }

                if (point.pos === 6) {
                    // Right
                    point.connections.push({ shell: i, point: 5, action: Action.Right });

                    // Left
                    point.connections.push({ shell: i, point: 7, action: Action.Left });

                    // Up
                    if (i === 0) { // Means Shellno. 1
                        point.connections.push({ core: true, action: Action.Up });
                    }
                    else {
                        point.connections.push({ shell: i - 1, point: 6, action: Action.Up });
                    }

                    // Down (only if not last shell)
                    if (i < this.field.shells.length - 1) {
                        point.connections.push({ shell: i + 1, point: 6, action: Action.Down });
                    }
                }

                if (point.pos === 7) {
                    // Right
                    point.connections.push({ shell: i, point: 6, action: Action.Right });

                    // Up
                    point.connections.push({ shell: i, point: 0, action: Action.Up });

                    // UpRight
                    if (i === 0) { // Means Shellno. 1
                        point.connections.push({ core: true, action: Action.UpRight });
                    }
                    else {
                        point.connections.push({ shell: i - 1, point: 7, action: Action.UpRight });
                    }

                    // DownLeft (only if not last shell)
                    if (i < this.field.shells.length - 1) {
                        point.connections.push({ shell: i + 1, point: 7, action: Action.DownLeft });
                    }
                }
            }
        }
    }

    #checkIfTie(turn: BasePlayer) {
        const moves = [];
        const player = turn === this.p1 ? this.p2 : this.p1;

        if (this.field.core.fill?.player === player) {
            const actions = [];

            for (const connection of this.field.core.connections) {
                if (connection.core && this.field.core.fill === null) {
                    actions.push(connection);
                } else if (!connection.core && this.field
                    .shells[connection.shell as number]
                    .points[connection.point as number]
                    .fill === null) actions.push(connection);
            }

            if (actions.length > 0) moves.push({ core: true, actions });
        }

        for (let i = 0; i < this.field.shells.length; i++) {
            for (let j = 0; j < this.field.shells[i].points.length; j++) {
                if (this.field.shells[i].points[j].fill?.player === player) {
                    const actions = [];

                    for (const connection of this.field.shells[i].points[j].connections) {
                        if (connection.core && this.field.core.fill === null) {
                            actions.push(connection);
                        } else if (!connection.core && this.field
                            .shells[connection.shell as number]
                            .points[connection.point as number]
                            .fill === null) actions.push(connection);
                    }

                    if (actions.length > 0) moves.push({ shell: i, point: j, actions });
                }
            }
        }

        return moves.length === 0;
    }

    #checkIfWon(player: BasePlayer) {
        if (this.field.core.fill?.player !== player) return false;

        const winCombis = [
            [0, 4],
            [1, 5],
            [2, 6],
            [3, 7]
        ];

        for (const combi of winCombis) {
            let won = true;
            for (let i = 0; i < this.shellCount; i++) {
                if (this.field.shells[i].points[combi[0]].fill?.player !== player ||
                    this.field.shells[i].points[combi[1]].fill?.player !== player) won = false;
            }

            if (won) return won;
        }

        return false;
    }

    #tieGame() {
        this.state = GameState.END;
        this.tie++;
    }

    #endGame(p: BasePlayer) {
        if (p === this.p1) { this.p1.won(); }
        if (p === this.p2) { this.p2.won(); }
        this.state = GameState.END;
        this.winner = p;
    }

    #getPosOfStone(stone: IStone): IPosition | undefined {
        if (this.field.core.fill === stone) return { core: true };
        for (let i = 0; i < this.field.shells.length; i++) {
            for (let j = 0; j < this.field.shells[i].points.length; j++) {
                if (this.field.shells[i].points[j].fill === stone)
                    return { core: false, shell: i, point: j };
            }
        }
    }

    #getNewPosOfStone(action: Action, pos: IPosition): IPosition {
        if (pos.core) {
            const connection = this.field.core.connections.find((c) => c.action === action);
            return { core: false, shell: 0, point: connection?.point };
        } else {
            const connection = this.field.shells[pos.shell as number]
                .points[pos.point as number]
                .connections.find((c) => c.action === action);
            return { core: connection?.core, shell: connection?.shell, point: connection?.point }
        }
    }

    #checkIfMoveIsPossible(action: number, pos: IPosition) {
        if (pos.core) {
            const connection = this.field.core.connections.find((c) => c.action === action);
            if (!connection) return false;
            if (this.field.shells[connection.shell as number].points[connection.point as number].fill !== null) return false;
        } else {
            const connection = this.field
                .shells[pos.shell as number]
                .points[pos.point as number]
                .connections.find((c) => c.action === action);
            if (!connection) return false;
            if (connection.core) {
                if (this.field.core.fill !== null) return false;
            }
            else if (this.field
                .shells[connection.shell as number]
                .points[connection.point as number]
                .fill !== null) return false;
        }

        return true;
    }

    #moveStone(oldPos: IPosition, newPos: IPosition, player: BasePlayer) {
        if (oldPos.core) {
            this.field.core.fill = null;
        } else {
            this.field.shells[oldPos.shell as number].points[oldPos.point as number].fill = null;
        }

        if (newPos.core) {
            this.field.core.fill = { player };
        } else {
            this.field.shells[newPos.shell as number].points[newPos.point as number].fill = { player };
        }
    }

    resetGame() {
        this.initField();

        this.state = GameState.PLACE_PHASE;
        this.winner = undefined;
        this.p1.resetStones(2 * this.shellCount + 1);
        this.p2.resetStones(2 * this.shellCount + 1);
    }

    placeStone(pos: IPosition, stone: IStone, callback: Function | null) {
        if (this.state !== GameState.PLACE_PHASE) return false;
        if (!this.placeCoreAllowed && pos.core) return false;
        if (pos.core && this.field.core.fill) return false;
        if (!pos.core && this.field.shells[pos.shell as number].points[pos.point as number].fill) return false;
        if (stone.player !== this.turn) return false;

        if (pos.core) {
            this.field.core.fill = stone;
        } else {
            this.field.shells[pos.shell as number].points[pos.point as number].fill = stone;
        }

        stone.player.placeStone();

        if (this.callback) { this.callback(); this.callback = null; }
        if (callback) this.callback = callback;

        if (this.#checkIfWon(this.turn)) {
            this.#endGame(this.turn);
            return true;
        }

        if (this.turn === this.p1) this.turn = this.p2
        else this.turn = this.p1;

        if (this.p1.StonesLeft === 0 && this.p2.StonesLeft === 0) {
            if (this.#checkIfTie(this.turn)) {
                this.#tieGame();
                return true;
            } else this.state = GameState.MOVE_PHASE;
        }

        return true;
    }

    moveStone(action: number, pos: IPosition, callback: Function | null) {
        if (this.state !== GameState.MOVE_PHASE) return false;
        if (pos.core && this.field.core.fill?.player !== this.turn) return false;
        else if (!pos.core &&
            this.field
                .shells[pos.shell as number]
                .points[pos.point as number]
                .fill?.player !== this.turn)
            return false;
        if (!this.#checkIfMoveIsPossible(action, pos)) return false;

        const newPos = this.#getNewPosOfStone(action, pos);
        if (!newPos) throw new Error("Could not find stone.");

        this.#moveStone(pos, newPos, this.turn);

        if (this.callback) { this.callback(); this.callback = null; }
        if (callback) this.callback = callback;

        if (this.#checkIfWon(this.turn)) {
            this.#endGame(this.turn);
            return true;
        } else if (this.#checkIfTie(this.turn)) {
            this.#tieGame();
            return true;
        }

        if (this.turn === this.p1) this.turn = this.p2
        else this.turn = this.p1;

        return true;
    }

    takeTurn() {
        let turnCompleted = false;
        do {
            if (this.state === GameState.PLACE_PHASE) {
                const { pos, callback } = this.turn.choosePlaceAction(this.field);
                turnCompleted = this.placeStone(pos, { player: this.turn }, callback);
                // if (callback) callback();
            } else if (this.state === GameState.MOVE_PHASE) {
                const { action, pos, callback } = this.turn.chooseMoveAction(this.field);
                turnCompleted = this.moveStone(action, pos, callback);
                // if (callback) callback();
            }

            // Logs every successfull move
            // if (turnCompleted) printField(g.GameField);
        }
        while (!turnCompleted)
    }
}