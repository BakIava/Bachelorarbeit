import { replaceAt } from "../helper/helper";
import { FieldType } from "../model/FieldType";
import { IStone } from "../model/IStone";
import { BasePlayer } from "./base-player";
import { Action } from "../model/Action";

export class AlgorithmPlayer extends BasePlayer {

    private q: Map<string, Map<any, number>>;
    private eps: number;
    private alpha: number;
    private gamma: number;
    private r: number;

    constructor(name: string) {
        super("algorithm-player-" + name);
        this.q = new Map();
        this.initQ();
        this.eps = 0.1;
        this.alpha = 0.5;
        this.gamma = 0.99;
        this.r = -1;
    }

    private getField(state: string): string[][] | undefined {
        const field = [];
        const splits = state.match(/.{1,3}/g);
        if (!splits) return;
        for (const split of splits) {
            const s = split.match(/.{1,1}/g)
            if (!s) return;
            field.push(s);
        }

        return field;
    }

    /**
     * In this method, we iterate through every cell in the field and check
     * if the stone is from Player-1 (meaning 0), where it could move
     * and add it to the actions array
     * @param state 
     * @returns 
     */
    private getMoveActionsForState(state: string) {
        const actions = [];
        const field = this.getField(state);
        if (!field) return [];

        for (let row = 0; row < field.length; row++) {
            for (let col = 0; col < field[row].length; col++) {
                if (field[row][col] !== '1') continue;

                if (col !== 2 && field[row][col + 1] === '0') actions.push({ action: Action.Right, row, col });
                if (col !== 0 && field[row][col - 1] === '0') actions.push({ action: Action.Left, row, col });
                if (row !== 0 && field[row - 1][col] === '0') actions.push({ action: Action.Up, row, col });
                if (row !== 2 && field[row + 1][col] === '0') actions.push({ action: Action.Down, row, col });
                if (((row === 2 && col === 0) || (col === 1 && row === 1)) && field[row - 1][col + 1] === '0') actions.push({ action: Action.UpRight, row, col });
                if (((row === 2 && col === 2) || (col === 1 && row === 1)) && field[row - 1][col - 1] === '0') actions.push({ action: Action.UpLeft, row, col });
                if (((row === 0 && col === 0) || (col === 1 && row === 1)) && field[row + 1][col + 1] === '0') actions.push({ action: Action.DownRight, row, col });
                if (((row === 0 && col === 2) || (col === 1 && row === 1)) && field[row + 1][col - 1] === '0') actions.push({ action: Action.DownLeft, row, col });
            }
        }

        return actions;
    }

    /**
     * Here we get a string which consists of 9 characters of 0 or 1, representing the whole field 
     * with already occipied fields (meaning a stone is here  = 1) and free fields (1)
     * A Place Action is a number between 0 and 8
     * The Action 0 means that a Stone is placed to the 0-th place of the field (top-left)
     * The Action 8 means that a Stone is placed to the 8-th place of the field (bottom-right)
     */
    private getPlaceActionsForState(state: string) {
        const actions = [];
        for (let i = 0; i < state.length; i++) {
            if (state.charAt(i) === '0') actions.push(i);
        }

        return actions;
    }

    /**
     * in this method the calculation of the possible field variations with given stone distribution is done
     * to calculate this reliably, it uses binary counting
     * 
     * In the first part it counts up to 511, so it all 9 bits are filled
     * and everytime the count of stones from the distribution is found, a field variation is saved
     * 
     * In the second part it counts again using the binary counting to get the variation of the stones,
     * but with depending on how many stones are there 
     * so if 1x Player-1 Stone and 2x Player-2 Stone
     * it counts up to 7, because of 3 stones. 
     * 
     * After getting the stone variation with the field variation
     * A string-array is is build and returned 
     * consisting of strings with 9 Characters with 0, 1 or 2
     * 
     * exm: [122000000, 212000000, 122000000, 221000000, 012200000, ...]
     * @param dist 
     * @returns 
     */
    private getStatesForDistribution(dist: { p1: number, p2: number }): string[] {
        const stones = dist.p1 + dist.p2;

        const fieldCombi = [];
        for (let i = 0; i < 512; i++) {
            const bits = i.toString(2).padStart(9, '0');

            let count = 0;
            for (let j = 0; j < bits.length; j++) {
                if (bits[j] === '1') count++;
            }

            if (count === stones) fieldCombi.push(bits);
        }

        const stoneCombi = [];
        for (let i = 0; i < Math.pow(2, stones); i++) {
            const bits = i.toString(2).padStart(stones, '0');

            let count = 0;
            for (let j = 0; j < bits.length; j++) {
                if (bits[j] === '1') count++;
            }

            if (count === dist.p1) stoneCombi.push(bits);
        }

        const convertedFields: string[] = [];

        for (let i = 0; i < fieldCombi.length; i++) {
            for (const combi of stoneCombi) {
                let convertedField = fieldCombi[i].slice();
                let currentChar = 0;
                for (let j = 0; j < fieldCombi[i].length; j++) {
                    if (fieldCombi[i].charAt(j) !== '1') continue;

                    if (combi.charAt(currentChar) === '1') convertedField = replaceAt(convertedField, j, '1');
                    else convertedField = replaceAt(convertedField, j, '2');

                    currentChar++;
                }

                convertedFields.push(convertedField);
            }
        }

        return convertedFields;
    }

    /**
     * Initializing every Place-State-Action
     */
    private addPlacePhaseStateActions() {
        const stoneDistribution: { p1: number, p2: number }[] = [
            { p1: 0, p2: 0 },
            { p1: 1, p2: 0 },
            { p1: 0, p2: 1 },
            { p1: 1, p2: 1 },
            { p1: 2, p2: 1 },
            { p1: 1, p2: 2 },
            { p1: 2, p2: 2 },
            { p1: 3, p2: 2 },
            { p1: 2, p2: 3 }
        ]

        for (let i = 0; i < stoneDistribution.length; i++) {
            const dist = stoneDistribution[i];

            const states = this.getStatesForDistribution(dist);

            for (const state of states) {
                const actions = this.getPlaceActionsForState(state);
                if (!this.q.has(state)) this.q.set(state, new Map());

                for (const action of actions) {
                    this.q.get(state)?.set(action, 0);
                }
            }
        }
    }

    private checkIfStateIsGoal(state: string): boolean {
        if (state.charAt(4) === '1' &&
            state.charAt(0) === '1' &&
            state.charAt(8) === '1') return true;

        if (state.charAt(4) === '1' &&
            state.charAt(1) === '1' &&
            state.charAt(7) === '1') return true;

        if (state.charAt(4) === '1' &&
            state.charAt(2) === '1' &&
            state.charAt(6) === '1') return true;

        if (state.charAt(4) === '1' &&
            state.charAt(3) === '1' &&
            state.charAt(5) === '1') return true;

        return false;
    }

    /**
     * Initializing every Move-State-Action
     */
    private addMovePhaseStateActions() {
        const states = this.getStatesForDistribution({ p1: 3, p2: 3 });

        for (const state of states) {
            const actions = this.getMoveActionsForState(state);
            if (!this.q.has(state)) this.q.set(state, new Map());

            for (const action of actions) {
                if (this.checkIfStateIsGoal(state)) this.q.get(state)?.set(action, 1);
                else this.q.get(state)?.set(action, 0);
            }
        }
    }

    private initQ() {
        this.addPlacePhaseStateActions();
        this.addMovePhaseStateActions();
    }

    private convertField(field: FieldType[][]): string {
        let convertedField = '';
        for (let i = 0; i < field.length; i++) {
            for (let j = 0; j < field[i].length; j++) {
                if (field[i][j] === null) convertedField += '0';
                else if (field[i][j]?.player === this) convertedField += '1';
                else convertedField += '2';
            }
        }

        return convertedField;
    }

    private chooseAction(state: string): any {
        let action: number | null = null;
        if (Math.random() <= this.eps) { // Select random action
            const randomIndex = Math.floor(Math.random() * this.q.get(state)!.size);
            action = Array.from(this.q.get(state)!.keys())[randomIndex];
        }
        else { // Exploit action
            let max = Array.from(this.q.get(state)!.values())[0];
            action = Array.from(this.q.get(state)!.keys())[0];

            for (const entry of this.q.get(state)!.entries()) {
                if (max < entry[1]) {
                    max = entry[1];
                    action = entry[0];
                }
            }
        }

        if (action == null) throw new Error();

        return action;
    }

    private updateQ(state: string, action: number | { action: number, row: number, col: number }, field: FieldType[][]) {
        let nextState = this.convertField(field);
        let nextAction = this.chooseAction(nextState);
        let nextQValue = this.q.get(nextState)!.get(nextAction) as number;

        let oldQ_Value = this.q.get(state)!.get(action) as number;

        let newQ_Value = oldQ_Value + this.alpha * (this.r + this.gamma * nextQValue - oldQ_Value);

        this.q.get(state)?.set(action, newQ_Value);
    }

    choosePlaceAction(field: FieldType[][]): { col: number; row: number; callback: Function | null } {
        // Implementation of how to choose a place action
        let state = this.convertField(field);

        // choose Action 
        let action: number = this.chooseAction(state);

        return {
            row: Math.floor(action / 3),
            col: action % 3,
            callback: () => this.updateQ(state, action as number, field)
        };
    }
    chooseMoveAction(field: FieldType[][]): { action: number; stone: IStone; callback: Function | null } {
        // Implementation of how to choose a move action
        let state = this.convertField(field);

        // choose Action
        let action: { action: number, row: number, col: number } = this.chooseAction(state);

        return {
            action: action.action,
            stone: field[action.row][action.col] as IStone,
            callback: () => this.updateQ(state, action, field)
        }
    }
}