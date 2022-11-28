import { Game } from "./game";
import { FieldType } from "./model/FieldType";
import { IHistory } from "./model/IHistory";
import { AlgorithmPlayer } from "./player/algorithm-player";
// import { AlgorithmPlayer } from "./player/algorithm-player";
import { BasePlayer } from "./player/base-player";
import { RandomPlayer } from "./player/random-player";

function printField(field: FieldType[][]) {
    const print = [['', '', ''], ['', '', ''], ['', '', '']];

    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[i].length; j++) {
            if (field[i][j] !== null) print[i][j] = field[i][j]!.player.Name;
        }
    }

    console.table(print);
}

function printScore(g: Game, episodes: number) {
    console.log((new Date()).toLocaleTimeString() + ' Score');
    console.table({ TotalGames: episodes, [g.FirstPlayer.Name]: g.FirstPlayer.GameSore, [g.SecondPlayer.Name]: g.SecondPlayer.GameSore, 'Tie': g.TieCount });
    console.table({ TotalGames: episodes, [g.FirstPlayer.Name]: (g.FirstPlayer.GameSore / episodes * 100).toFixed(2) + ' %', [g.SecondPlayer.Name]: (g.SecondPlayer.GameSore / episodes * 100).toFixed(2) + ' %', 'Tie': (g.TieCount / episodes * 100).toFixed(2) + ' %' });
}

function printResult(g: Game, episodes: number) {
    console.log(`Player ${g.GameWinner?.Name} won!`);
    // printField(g.GameField);
    printScore(g, episodes);
}

function displayMemory(): void {
    setTimeout(displayMemory, 5000);    
    console.log(process.memoryUsage());
}

export function start(p1: BasePlayer, p2: BasePlayer, episodes: number, shellCount: number) {    

    // export function start() {
    // const shellCount = 1;
    const g = new Game(p1, p2, shellCount, true);
    // const g = new Game(new AlgorithmPlayer('1', shellCount, { Alpha: 0.5, Epsilon: 0.1, Gamma: 0.99, Reward: -0.01, Random: false }),
    //     new RandomPlayer('2', shellCount), shellCount, true);
    // const episodes = 100000;

    const history: IHistory = {
        score: [],
        move: []
    };

    for (let i = 0; i < episodes; i++) {
        while (g.GameIsStillRunning) {
            g.takeTurn();
        }

        if (g.GameWinner) {
            if (g.GameWinner.Name === g.FirstPlayer.Name) history.score.push(1)
            else history.score.push(2)
        } else history.score.push(0); // Tie

        g.resetGame();
    }
    
    displayMemory();

    printScore(g, episodes);

    if (p1 instanceof AlgorithmPlayer) history.move = (p1 as AlgorithmPlayer).Moves;

    return {
        q: p1 instanceof AlgorithmPlayer ? (p1 as AlgorithmPlayer).QValue : {},
        score: {
            p1: g.FirstPlayer.GameSore,
            p2: g.SecondPlayer.GameSore
        },
        history,
    };
}
