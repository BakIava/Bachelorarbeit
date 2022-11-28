import { replaceAt } from "../helper/helper";
import { FieldType } from "../model/FieldType";
import { IStone } from "../model/IStone";
import { BasePlayer } from "./base-player";
import { Action } from "../model/Action";
import { IField, IPosition } from "../game";

export class AlgorithmPlayer extends BasePlayer {

    private q: Map<string, Map<any, number>>;
    private eps: number;
    private alpha: number;
    private gamma: number;
    private r: number;
    private randomQInit: boolean;

    // History Values
    private move: any[] = [];

    get Moves() { return this.move; }

    get QValue() {
        console.log((new Date()).toLocaleTimeString() + ' [Algorithm] Converting Q Value to Array...');
        const QValue = [];

        for (const state of this.q.keys()) {
            if (!state || !this.q.get(state)) continue;

            const actions = [];
            for (const action of this.q.get(state)!.keys()) {
                actions.push({
                    action: action,
                    value: this.q.get(state)?.get(action)
                });
            }

            QValue.push({
                state: state,
                actionValue: actions
            });

            this.q.get(state)?.clear();
        }

        return QValue;
    }

    constructor(name: string, shellCount: number, options: { Alpha: number, Epsilon: number, Gamma: number, Random: boolean, Reward: number }) {
        console.log((new Date()).toLocaleTimeString() + ' [Algorithm] Name: ' + name);
        console.log((new Date()).toLocaleTimeString() + ' [Algorithm] ShellCount: ' + shellCount);
        console.log((new Date()).toLocaleTimeString() + ' [Algorithm] RandomQ: ' + options.Random);
        console.log((new Date()).toLocaleTimeString() + ' [Algorithm] Epsilon: ' + options.Epsilon);
        console.log((new Date()).toLocaleTimeString() + ' [Algorithm] Alpha: ' + options.Alpha);
        console.log((new Date()).toLocaleTimeString() + ' [Algorithm] Gamma: ' + options.Gamma);
        console.log((new Date()).toLocaleTimeString() + ' [Algorithm] Reward: ' + options.Reward);

        super("algorithm-player-" + name, shellCount);
        this.q = new Map();
        this.randomQInit = options.Random;
        this.initQ();
        this.eps = options.Epsilon;
        this.alpha = options.Alpha;
        this.gamma = options.Gamma;
        this.r = options.Reward;
    }

    private getField(state: string): { core: string, shells: string[] } {
        const field = {
            core: state.charAt(0),
            shells: [] as string[]
        }

        const splits = state.substring(1).match(/.{1,8}/g) as string[];

        field.shells = splits;

        return field;
        // for (let i = 0; i < splits.length; i++) {
        //     for (let j = 0; j < splits[i].length; j++) {

        //     }
        // }


        // const field = [];
        // const splits = state.match(/.{1,3}/g);
        // if (!splits) return;
        // for (const split of splits) {
        //     const s = split.match(/.{1,1}/g)
        //     if (!s) return;
        //     field.push(s);
        // }

        // return field;
    }

    /**
     * In this method, we iterate through every cell in the field and check
     * if the stone is from Player-1 (meaning 0), where it could move
     * and add it to the actions array
     * @param state 
     * @returns 
     */
    private getMoveActionsForState(state: string) {
        // pos = wen bewegen
        // action = welche action no.
        const actions: { pos: number, action: Action }[] = [
            // { pos: 0, action: 0 }
        ]

        const field = this.getField(state);

        // Get Core Actions
        if (field.core === '1') {
            const firstShell = field.shells[0];

            if (firstShell.charAt(0) === '0') {
                actions.push({ pos: 0, action: Action.Left });
            }

            if (firstShell.charAt(1) === '0') {
                actions.push({ pos: 0, action: Action.UpLeft });
            }

            if (firstShell.charAt(2) === '0') {
                actions.push({ pos: 0, action: Action.Up });
            }

            if (firstShell.charAt(3) === '0') {
                actions.push({ pos: 0, action: Action.UpRight });
            }

            if (firstShell.charAt(4) === '0') {
                actions.push({ pos: 0, action: Action.Right });
            }

            if (firstShell.charAt(5) === '0') {
                actions.push({ pos: 0, action: Action.DownRight });
            }

            if (firstShell.charAt(6) === '0') {
                actions.push({ pos: 0, action: Action.Down });
            }

            if (firstShell.charAt(7) === '0') {
                actions.push({ pos: 0, action: Action.DownLeft });
            }
        }

        for (let i = 0; i < field.shells.length; i++) {
            const shell = field.shells[i];
            for (let j = 0; j < field.shells[i].length; j++) {
                if (shell.charAt(j) !== '1') continue;
                const pos = i * 8 + j + 1;

                if (j === 0) {
                    // Up
                    if (shell.charAt(1) === '0') actions.push({ pos, action: Action.Up })

                    // Right
                    if (i === 0) { // Means Shellno. 1
                        if (field.core === '0') actions.push({ pos, action: Action.Right })
                    }
                    else {
                        if (field.shells[i - 1].charAt(0) === '0') actions.push({ pos, action: Action.Right });
                    }

                    // Down
                    if (shell.charAt(7) === '0') actions.push({ pos, action: Action.Down });

                    // Left (only if not last shell)
                    if (i < field.shells.length - 1) {
                        if (field.shells[i + 1].charAt(0) === '0') actions.push({ pos, action: Action.Left });
                    }
                }

                if (j === 1) {
                    // Right                    
                    if (shell.charAt(2) === '0') actions.push({ pos, action: Action.Right });

                    // DownRight
                    if (i === 0) { // Means Shellno. 1
                        if (field.core === '0') actions.push({ pos, action: Action.DownRight });
                    }
                    else {
                        if (field.shells[i - 1].charAt(1) === '0') actions.push({ pos, action: Action.DownRight });
                    }

                    // Down
                    if (shell.charAt(0) === '0') actions.push({ pos, action: Action.Down });

                    // UpLeft (only if not last shell)
                    if (i < field.shells.length - 1) {
                        if (field.shells[i + 1].charAt(1) === '0') actions.push({ pos, action: Action.UpLeft });
                    }
                }

                if (j === 2) {
                    // Right
                    if (shell.charAt(3) === '0') actions.push({ pos, action: Action.Right });

                    // Down
                    if (i === 0) { // Means Shellno. 1
                        if (field.core === '0') actions.push({ pos, action: Action.Down });
                    }
                    else {
                        if (field.shells[i - 1].charAt(2) === '0') actions.push({ pos, action: Action.Down });
                    }

                    // Left
                    if (shell.charAt(1) === '0') actions.push({ pos, action: Action.Left });

                    // Up (only if not last shell)
                    if (i < field.shells.length - 1) {
                        if (field.shells[i + 1].charAt(2) === '0') actions.push({ pos, action: Action.Up });
                    }
                }

                if (j === 3) {
                    // Down
                    if (shell.charAt(4) === '0') actions.push({ pos, action: Action.Down });

                    // DownLeft
                    if (i === 0) { // Means Shellno. 1
                        if (field.core === '0') actions.push({ pos, action: Action.DownLeft });
                    }
                    else {
                        if (field.shells[i - 1].charAt(3) === '0') actions.push({ pos, action: Action.DownLeft });
                    }

                    // Left
                    if (shell.charAt(2) === '0') actions.push({ pos, action: Action.Left });

                    // UpRight (only if not last shell)
                    if (i < field.shells.length - 1) {
                        if (field.shells[i + 1].charAt(3) === '0') actions.push({ pos, action: Action.UpRight });
                    }
                }

                if (j === 4) {
                    // Down
                    if (shell.charAt(5) === '0') actions.push({ pos, action: Action.Down });

                    // Left
                    if (i === 0) { // Means Shellno. 1
                        if (field.core === '0') actions.push({ pos, action: Action.Left });
                    }
                    else {
                        if (field.shells[i - 1].charAt(4) === '0') actions.push({ pos, action: Action.Left });
                    }

                    // Up
                    if (shell.charAt(3) === '0') actions.push({ pos, action: Action.Up });

                    // Right (only if not last shell)
                    if (i < field.shells.length - 1) {
                        if (field.shells[i + 1].charAt(4) === '0') actions.push({ pos, action: Action.Right });
                    }
                }

                if (j === 5) {
                    // Left
                    if (shell.charAt(6) === '0') actions.push({ pos, action: Action.Left });

                    // UpLeft
                    if (i === 0) { // Means Shellno. 1
                        if (field.core === '0') actions.push({ pos, action: Action.UpLeft });
                    }
                    else {
                        if (field.shells[i - 1].charAt(5) === '0') actions.push({ pos, action: Action.UpLeft });
                    }

                    // Up
                    if (shell.charAt(4) === '0') actions.push({ pos, action: Action.Up });

                    // DownRight (only if not last shell)
                    if (i < field.shells.length - 1) {
                        if (field.shells[i + 1].charAt(5) === '0') actions.push({ pos, action: Action.DownRight });
                    }
                }

                if (j === 6) {
                    // Right
                    if (shell.charAt(5) === '0') actions.push({ pos, action: Action.Right });

                    // Left
                    if (shell.charAt(7) === '0') actions.push({ pos, action: Action.Left });

                    // Up
                    if (i === 0) { // Means Shellno. 1
                        if (field.core === '0') actions.push({ pos, action: Action.Up });
                    }
                    else {
                        if (field.shells[i - 1].charAt(6) === '0') actions.push({ pos, action: Action.Up });
                    }

                    // Down (only if not last shell)
                    if (i < field.shells.length - 1) {
                        if (field.shells[i + 1].charAt(6) === '0') actions.push({ pos, action: Action.Down });
                    }
                }

                if (j === 7) {
                    // Right
                    if (shell.charAt(6) === '0') actions.push({ pos, action: Action.Right });

                    // Up
                    if (shell.charAt(0) === '0') actions.push({ pos, action: Action.Up });

                    // UpRight
                    if (i === 0) { // Means Shellno. 1
                        if (field.core === '0') actions.push({ pos, action: Action.UpRight });
                    }
                    else {
                        if (field.shells[i - 1].charAt(7) === '0') actions.push({ pos, action: Action.UpRight });
                    }

                    // DownLeft (only if not last shell)
                    if (i < field.shells.length - 1) {
                        if (field.shells[i + 1].charAt(7) === '0') actions.push({ pos, action: Action.DownLeft });
                    }
                }
            }
        }

        return actions;

        // const actions = [];
        // const field = this.getField(state);
        // if (!field) return [];

        // for (let row = 0; row < field.length; row++) {
        //     for (let col = 0; col < field[row].length; col++) {
        //         if (field[row][col] !== '1') continue;

        //         if (col !== 2 && field[row][col + 1] === '0') actions.push({ action: Action.Right, row, col });
        //         if (col !== 0 && field[row][col - 1] === '0') actions.push({ action: Action.Left, row, col });
        //         if (row !== 0 && field[row - 1][col] === '0') actions.push({ action: Action.Up, row, col });
        //         if (row !== 2 && field[row + 1][col] === '0') actions.push({ action: Action.Down, row, col });
        //         if (((row === 2 && col === 0) || (col === 1 && row === 1)) && field[row - 1][col + 1] === '0') actions.push({ action: Action.UpRight, row, col });
        //         if (((row === 2 && col === 2) || (col === 1 && row === 1)) && field[row - 1][col - 1] === '0') actions.push({ action: Action.UpLeft, row, col });
        //         if (((row === 0 && col === 0) || (col === 1 && row === 1)) && field[row + 1][col + 1] === '0') actions.push({ action: Action.DownRight, row, col });
        //         if (((row === 0 && col === 2) || (col === 1 && row === 1)) && field[row + 1][col - 1] === '0') actions.push({ action: Action.DownLeft, row, col });
        //     }
        // }

        // return actions;
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

    private getStoneDistribution(stones: number) {
        const stoneDistribution: { p1: number, p2: number }[] = [];

        let p1First = true;
        let allDistribution = false;
        for (let i = 0; i < stones; i++) {
            let distCount = 0;
            while (!allDistribution) {
                const distribution = { p1: 0, p2: 0 };

                let placeIndex;

                if (p1First) {
                    placeIndex = 'p1';
                    p1First = false;
                } else {
                    placeIndex = 'p2';
                    p1First = true;
                }

                for (let j = i; j > 0; j--) {
                    distribution[placeIndex as 'p1' | 'p2']++;
                    placeIndex = placeIndex === 'p1' ? 'p2' : 'p1';
                }

                stoneDistribution.push(distribution);
                distCount++;

                if (i % 2 === 0) allDistribution = true;
                else if (distCount === 2) allDistribution = true;
            }
            allDistribution = false;
            p1First = true;
        }

        return stoneDistribution;
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
        for (let i = 0; i < Math.pow(2, this.shellCount * 8 + 1); i++) {
            const bits = i.toString(2).padStart(this.shellCount * 8 + 1, '0');

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
        console.log((new Date()).toLocaleTimeString() + ' [Algorithm] Init place states');

        const stoneDistribution: { p1: number, p2: number }[] = this.getStoneDistribution(this.StonesLeft * 2);

        let size = 0;
        for (let i = 0; i < stoneDistribution.length; i++) {
            const dist = stoneDistribution[i];

            const states = this.getStatesForDistribution(dist);
            size += states.length;
            for (const state of states) {
                const actions = this.getPlaceActionsForState(state);
                if (!this.q.has(state)) this.q.set(state, new Map());

                for (const action of actions) {
                    if (this.checkIfStateIsGoal(state, '1')) this.q.get(state)?.set(action, this.randomQInit ? 0 : 1);
                    else if (this.checkIfBadPlace(state, action)) this.q.get(state)?.set(action, -1);
                    else this.q.get(state)?.set(action, this.randomQInit ? Math.random() : 0);
                }
            }
        }

        console.log((new Date()).toLocaleTimeString() + ' [Algorithm] Place states count: ' + size);
    }

    private checkIfBadPlace(state: string, action: number): boolean {
        const winCombis = [
            [0, 4],
            [1, 5],
            [2, 6],
            [3, 7]
        ];


        for (const combi of winCombis) {
            let missingForWin = [];
            let bad = true;

            if (state.charAt(0) === '0') missingForWin.push(0);

            for (let i = 0; i < this.shellCount; i++) {
                if (state.charAt(i * 8 + combi[0] + 1) === '1' ||
                    state.charAt(i * 8 + combi[1] + 1) === '1') { bad = false; break; }

                if (state.charAt(i * 8 + combi[0] + 1) === '0') missingForWin.push(i * 8 + combi[0] + 1)
                if (state.charAt(i * 8 + combi[1] + 1) === '0') missingForWin.push(i * 8 + combi[1] + 1)
            }

            if (bad &&
                missingForWin.length === 1 &&
                !missingForWin.includes(action)) return true;
        }

        return false;

        // if (state.charAt(0) === '2' &&
        //     state.charAt(4) === '2' &&
        //     state.charAt(8) === '0' &&
        //     action !== 8) return true;

        // if (state.charAt(1) === '2' &&
        //     state.charAt(4) === '2' &&
        //     state.charAt(7) === '0' &&
        //     action !== 7) return true;

        // if (state.charAt(2) === '2' &&
        //     state.charAt(4) === '2' &&
        //     state.charAt(6) === '0' &&
        //     action !== 6) return true;

        // if (state.charAt(3) === '2' &&
        //     state.charAt(4) === '2' &&
        //     state.charAt(5) === '0' &&
        //     action !== 5) return true;

        // if (state.charAt(3) === '0' &&
        //     state.charAt(4) === '2' &&
        //     state.charAt(5) === '2' &&
        //     action !== 3) return true;

        // if (state.charAt(2) === '0' &&
        //     state.charAt(4) === '2' &&
        //     state.charAt(6) === '2' &&
        //     action !== 2) return true;

        // if (state.charAt(1) === '0' &&
        //     state.charAt(4) === '2' &&
        //     state.charAt(7) === '2' &&
        //     action !== 1) return true;

        // if (state.charAt(0) === '0' &&
        //     state.charAt(4) === '2' &&
        //     state.charAt(8) === '2' &&
        //     action !== 0) return true;

        // if (state.charAt(0) === '2' &&
        //     state.charAt(4) === '0' &&
        //     state.charAt(8) === '2' &&
        //     action !== 4) return true;

        // if (state.charAt(1) === '2' &&
        //     state.charAt(4) === '0' &&
        //     state.charAt(7) === '2' &&
        //     action !== 4) return true;

        // if (state.charAt(2) === '2' &&
        //     state.charAt(4) === '0' &&
        //     state.charAt(6) === '2' &&
        //     action !== 4) return true;

        // if (state.charAt(3) === '2' &&
        //     state.charAt(4) === '0' &&
        //     state.charAt(5) === '2' &&
        //     action !== 4) return true;

        // return false;
    }

    private checkIfBadMove(state: string, action: { pos: number, action: number }): boolean {
        const winCombis = [
            [0, 4],
            [1, 5],
            [2, 6],
            [3, 7]
        ];


        for (const combi of winCombis) {
            let missingForWin = [];
            let bad = true;

            if (state.charAt(0) === '0') missingForWin.push(0);

            for (let i = 0; i < this.shellCount; i++) {
                if (state.charAt(i * 8 + combi[0] + 1) === '1' ||
                    state.charAt(i * 8 + combi[1] + 1) === '1') { bad = false; break; }

                if (state.charAt(i * 8 + combi[0] + 1) === '0') missingForWin.push(i * 8 + combi[0] + 1)
                if (state.charAt(i * 8 + combi[1] + 1) === '0') missingForWin.push(i * 8 + combi[1] + 1)
            }


            if (bad && missingForWin.length === 1) {
                const missing = missingForWin[0];

                // middle missing
                if (missing === 0) {
                    if (action.pos === 1 && action.action !== Action.Right) return true;
                    if (action.pos === 2 && action.action !== Action.DownRight) return true;
                    if (action.pos === 3 && action.action !== Action.Down) return true;
                    if (action.pos === 4 && action.action !== Action.DownLeft) return true;
                    if (action.pos === 5 && action.action !== Action.Left) return true;
                    if (action.pos === 6 && action.action !== Action.UpLeft) return true;
                    if (action.pos === 7 && action.action !== Action.Up) return true;
                    if (action.pos === 8 && action.action !== Action.UpRight) return true;
                } else {
                    const pointIndex = (missing - 1) % 8;
                    const actionIndex = (action.pos - 1) % 8;

                    if (pointIndex === 0 &&
                        (
                            actionIndex === 1 && action.action === Action.Down ||
                            actionIndex === 7 && action.action === Action.Up
                        )) return false;

                    if (pointIndex === 1 &&
                        (
                            actionIndex === 0 && action.action === Action.Up ||
                            actionIndex === 2 && action.action === Action.Left
                        )) return false;

                    if (pointIndex === 2 &&
                        (
                            actionIndex === 1 && action.action === Action.Right ||
                            actionIndex === 3 && action.action === Action.Left
                        )) return false;

                    if (pointIndex === 3 &&
                        (
                            actionIndex === 2 && action.action === Action.Right ||
                            actionIndex === 4 && action.action === Action.Up
                        )) return false;

                    if (pointIndex === 4 &&
                        (
                            actionIndex === 3 && action.action === Action.Down ||
                            actionIndex === 5 && action.action === Action.Up
                        )) return false;

                    if (pointIndex === 5 &&
                        (
                            actionIndex === 4 && action.action === Action.Down ||
                            actionIndex === 6 && action.action === Action.Right
                        )) return false;

                    if (pointIndex === 6 &&
                        (
                            actionIndex === 5 && action.action === Action.Left ||
                            actionIndex === 7 && action.action === Action.Right
                        )) return false;

                    if (pointIndex === 6 &&
                        (
                            actionIndex === 6 && action.action === Action.Left ||
                            actionIndex === 0 && action.action === Action.Down
                        )) return false;

                    return true;
                }
            }
        }

        return false;


        // if (state.charAt(0) === '2' &&
        //     state.charAt(4) === '2' &&
        //     state.charAt(8) === '0' &&
        //     (
        //         (action.row === 1 && action.col === 2 && action.action !== 3) ||
        //         (action.row === 2 && action.col === 1 && action.action !== 0)
        //     )) return true;

        // if (state.charAt(1) === '2' &&
        //     state.charAt(4) === '2' &&
        //     state.charAt(7) === '0' &&
        //     (
        //         (action.row === 2 && action.col === 0 && action.action !== 0) ||
        //         (action.row === 2 && action.col === 2 && action.action !== 1)
        //     )) return true;

        // if (state.charAt(2) === '2' &&
        //     state.charAt(4) === '2' &&
        //     state.charAt(6) === '0' &&
        //     (
        //         (action.row === 1 && action.col === 0 && action.action !== 3) ||
        //         (action.row === 2 && action.col === 1 && action.action !== 1)
        //     )) return true;

        // if (state.charAt(3) === '2' &&
        //     state.charAt(4) === '2' &&
        //     state.charAt(5) === '0' &&
        //     (
        //         (action.row === 0 && action.col === 2 && action.action !== 3) ||
        //         (action.row === 2 && action.col === 2 && action.action !== 2)
        //     )) return true;

        // if (state.charAt(3) === '0' &&
        //     state.charAt(4) === '2' &&
        //     state.charAt(5) === '2' &&
        //     (
        //         (action.row === 0 && action.col === 0 && action.action !== 3) ||
        //         (action.row === 2 && action.col === 0 && action.action !== 2)
        //     )) return true;

        // if (state.charAt(2) === '0' &&
        //     state.charAt(4) === '2' &&
        //     state.charAt(6) === '2' &&
        //     (
        //         (action.row === 0 && action.col === 1 && action.action !== 0) ||
        //         (action.row === 1 && action.col === 2 && action.action !== 2)
        //     )) return true;

        // if (state.charAt(1) === '0' &&
        //     state.charAt(4) === '2' &&
        //     state.charAt(7) === '2' &&
        //     (
        //         (action.row === 0 && action.col === 0 && action.action !== 0) ||
        //         (action.row === 0 && action.col === 2 && action.action !== 1)
        //     )) return true;

        // if (state.charAt(0) === '0' &&
        //     state.charAt(4) === '2' &&
        //     state.charAt(8) === '2' &&
        //     (
        //         (action.row === 0 && action.col === 1 && action.action !== 1) ||
        //         (action.row === 1 && action.col === 0 && action.action !== 2)
        //     )) return true;

        // if (state.charAt(0) === '2' &&
        //     state.charAt(4) === '0' &&
        //     state.charAt(8) === '2' &&
        //     (
        //         (action.row === 0 && action.col === 1 && action.action !== 3) ||
        //         (action.row === 0 && action.col === 2 && action.action !== 7) ||
        //         (action.row === 1 && action.col === 0 && action.action !== 0) ||
        //         (action.row === 1 && action.col === 2 && action.action !== 1) ||
        //         (action.row === 2 && action.col === 0 && action.action !== 4) ||
        //         (action.row === 2 && action.col === 1 && action.action !== 2)
        //     )) return true;

        // if (state.charAt(1) === '2' &&
        //     state.charAt(4) === '0' &&
        //     state.charAt(7) === '2' &&
        //     (
        //         (action.row === 0 && action.col === 0 && action.action !== 6) ||
        //         (action.row === 0 && action.col === 2 && action.action !== 7) ||
        //         (action.row === 1 && action.col === 0 && action.action !== 0) ||
        //         (action.row === 1 && action.col === 2 && action.action !== 1) ||
        //         (action.row === 2 && action.col === 0 && action.action !== 4) ||
        //         (action.row === 2 && action.col === 2 && action.action !== 5)
        //     )) return true;

        // if (state.charAt(2) === '2' &&
        //     state.charAt(4) === '0' &&
        //     state.charAt(6) === '2' &&
        //     (
        //         (action.row === 0 && action.col === 0 && action.action !== 6) ||
        //         (action.row === 0 && action.col === 1 && action.action !== 3) ||
        //         (action.row === 1 && action.col === 0 && action.action !== 0) ||
        //         (action.row === 1 && action.col === 2 && action.action !== 1) ||
        //         (action.row === 2 && action.col === 1 && action.action !== 2) ||
        //         (action.row === 2 && action.col === 2 && action.action !== 5)
        //     )) return true;

        // if (state.charAt(3) === '2' &&
        //     state.charAt(4) === '0' &&
        //     state.charAt(5) === '2' &&
        //     (
        //         (action.row === 0 && action.col === 0 && action.action !== 6) ||
        //         (action.row === 0 && action.col === 1 && action.action !== 3) ||
        //         (action.row === 0 && action.col === 2 && action.action !== 7) ||
        //         (action.row === 2 && action.col === 0 && action.action !== 4) ||
        //         (action.row === 2 && action.col === 1 && action.action !== 2) ||
        //         (action.row === 2 && action.col === 2 && action.action !== 5)
        //     )) return true;


        // return false;
    }

    private checkIfStateIsGoal(state: string, player: '1' | '2'): boolean {
        if (state.charAt(0) !== player) return false;

        const winCombis = [
            [0, 4],
            [1, 5],
            [2, 6],
            [3, 7]
        ];

        for (const combi of winCombis) {
            let won = true;
            for (let i = 0; i < this.shellCount; i++) {
                if (state.charAt(i * 8 + combi[0] + 1) !== player ||
                    state.charAt(i * 8 + combi[1] + 1) !== player) won = false;
            }

            if (won) return true;
        }

        return false;


        // if (state.charAt(4) === player &&
        //     state.charAt(0) === player &&
        //     state.charAt(8) === player) return true;

        // if (state.charAt(4) === player &&
        //     state.charAt(1) === player &&
        //     state.charAt(7) === player) return true;

        // if (state.charAt(4) === player &&
        //     state.charAt(2) === player &&
        //     state.charAt(6) === player) return true;

        // if (state.charAt(4) === player &&
        //     state.charAt(3) === player &&
        //     state.charAt(5) === player) return true;

        // return false;
    }

    /**
     * Initializing every Move-State-Action
     */
    private addMovePhaseStateActions() {
        console.log((new Date()).toLocaleTimeString() + ' [Algorithm] Init move states');
        const states = this.getStatesForDistribution({ p1: this.StonesLeft, p2: this.StonesLeft });

        for (const state of states) {
            const actions = this.getMoveActionsForState(state);
            if (!this.q.has(state)) this.q.set(state, new Map());

            for (const action of actions) {
                if (this.checkIfStateIsGoal(state, '1')) this.q.get(state)?.set(action, this.randomQInit ? 0 : 1);
                if (this.checkIfStateIsGoal(state, '2')) this.q.get(state)?.set(action, -1);
                // else if (this.checkIfBadMove(state, action)) this.q.get(state)?.set(action, -1);
                else this.q.get(state)?.set(action, this.randomQInit ? Math.random() : 0);
            }
        }

        console.log((new Date()).toLocaleTimeString() + ' [Algorithm] Move states count: ' + states.length);
    }

    private initQ() {
        console.log((new Date()).toLocaleTimeString() + ' [Algorithm] Initializing Q...');
        this.addPlacePhaseStateActions();
        this.addMovePhaseStateActions();
        console.log((new Date()).toLocaleTimeString() + ' [Algorithm] Q initialized.');
    }

    private convertField(field: IField): string {
        let convertedField = '';

        if (field.core.fill) {
            if (field.core.fill.player === this) convertedField += '1';
            else convertedField += '2';
        } else convertedField += '0';

        for (let i = 0; i < field.shells.length; i++) {
            for (let j = 0; j < field.shells[i].points.length; j++) {
                const point = field.shells[i].points[j];

                if (point.fill) {
                    if (point.fill.player === this) convertedField += '1';
                    else convertedField += '2';
                } else convertedField += '0';
            }
        }




        // for (let i = 0; i < field.length; i++) {
        //     for (let j = 0; j < field[i].length; j++) {
        //         if (field[i][j] === null) convertedField += '0';
        //         else if (field[i][j]?.player === this) convertedField += '1';
        //         else convertedField += '2';
        //     }
        // }

        return convertedField;
    }

    private chooseAction(state: string): number | { pos: number, action: number } | undefined {
        let action: number;
        const randomIndex = Math.floor(Math.random() * this.q.get(state)!.size);
        if (Math.random() <= this.eps) { // Select random action
            action = Array.from(this.q.get(state)!.keys())[randomIndex];
        }
        else { // Exploit action
            let max = Array.from(this.q.get(state)!.values())[randomIndex];
            action = Array.from(this.q.get(state)!.keys())[randomIndex];

            for (const entry of this.q.get(state)!.entries()) {
                if (max < entry[1]) {
                    max = entry[1];
                    action = entry[0];
                }
            }
        }

        // if (action === undefined) throw new Error(state);

        return action;
    }

    private updateQ(state: string, action: number | { pos: number, action: number }, field: IField) {
        // History 
        this.move.push({ state, action });

        let nextState = this.convertField(field);
        let nextAction = this.checkIfStateIsGoal(nextState, '2') ? null : this.chooseAction(nextState);
        let nextQValue = nextAction == null ? -1 : this.q.get(nextState)!.get(nextAction) as number;

        let oldQ_Value = this.q.get(state)!.get(action) as number;

        let newQ_Value = oldQ_Value + this.alpha * (this.r + this.gamma * nextQValue - oldQ_Value);

        this.q.get(state)?.set(action, newQ_Value);
    }

    choosePlaceAction(field: IField): { pos: IPosition; callback: Function | null } {
        // Implementation of how to choose a place action
        let state = this.convertField(field);

        // choose Action 
        let action: number = this.chooseAction(state) as number;
        const shellIndex = Math.ceil(action / 8) - 1;
        const pointIndex = action - (shellIndex * 8) - 1

        return {
            pos: {
                core: action === 0,
                shell: action === 0 ? undefined : shellIndex,
                point: action === 0 ? undefined : pointIndex,
            },
            callback: () => this.updateQ(state, action as number, field)
        };
    }
    chooseMoveAction(field: IField): { pos: IPosition, action: number; callback: Function | null } {
        // Implementation of how to choose a move action
        let state = this.convertField(field);

        // choose Action
        let action = this.chooseAction(state) as { pos: number, action: number };
        const shellIndex = Math.ceil(action.pos / 8) - 1;
        const pointIndex = action.pos - (shellIndex * 8) - 1

        return {
            pos: {
                core: action.pos === 0,
                shell: action.pos === 0 ? undefined : shellIndex,
                point: action.pos === 0 ? undefined : pointIndex,
            },
            action: action.action,
            callback: () => this.updateQ(state, action, field)
        }
    }
}