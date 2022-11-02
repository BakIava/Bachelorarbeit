import { Action } from "../model/Action";
import { FieldType } from "../model/FieldType";
import { IStone } from "../model/IStone";
import { BasePlayer } from "./base-player";

export class RandomPlayer extends BasePlayer {

    constructor(name: string) {
        super("random-player-" + name)
    }

    choosePlaceAction(field: FieldType[][]) {
        return {
            row: Math.round(Math.random() * (field.length - 1)),
            col: Math.round(Math.random() * (field.length - 1))
        }
    }

    chooseMoveAction(field: FieldType[][]): { action: number, stone: IStone } {
        const stones = [];

        for (const row of field) {
            for (const cell of row) {
                if (cell?.player === this) stones.push(cell);
            }
        }

        const randomAction: Action = Math.round(Math.random() * (Object.keys(Action).length - 1));
        const randomStone = Math.round(Math.random() * (stones.length - 1));

        return { action: randomAction, stone: stones[randomStone] };
    }
}