import { FieldType } from "../model/FieldType";
import { IStone } from "../model/IStone";

export abstract class BasePlayer {
    #score: number;
    #id: string;
    #stones: number;

    get Name() { return this.#id; }
    get GameSore() { return this.#score; }
    get StonesLeft() { return this.#stones; }

    constructor(id: string) {
        this.#id = id;
        this.#score = 0;
        this.#stones = 3;
    }

    won(): void { this.#score++; }

    placeStone(): void {
        if (this.#stones > 0) this.#stones--;
    }

    resetStones(): void {
        this.#stones = 3;
    }

    abstract choosePlaceAction(field: FieldType[][]): { col: number, row: number, callback: Function | null };

    abstract chooseMoveAction(field: FieldType[][]): { action: number, stone: IStone, callback: Function | null };
}