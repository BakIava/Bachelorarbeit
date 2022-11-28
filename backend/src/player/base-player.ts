import { IField, IPosition } from "../game";
import { FieldType } from "../model/FieldType";
import { IStone } from "../model/IStone";

export abstract class BasePlayer {
    #score: number;
    #id: string;
    #stones: number;
    shellCount: number;

    get Name() { return this.#id; }
    get GameSore() { return this.#score; }
    get StonesLeft() { return this.#stones; }

    constructor(id: string, shellCount: number) {
        if(shellCount > 3) throw new Error('ShellCount cannot be bigger 3');
        this.#id = id;
        this.#score = 0;
        this.shellCount = shellCount;
        this.#stones = shellCount * 2 + 1;
    }

    won(): void { this.#score++; }

    placeStone(): void {
        if (this.#stones > 0) this.#stones--;
    }

    resetStones(stones: number): void {
        this.#stones = stones;
    }

    abstract choosePlaceAction(field: IField): { pos: IPosition, callback: Function | null };

    abstract chooseMoveAction(field: IField): { pos: IPosition, action: number, callback: Function | null };
}