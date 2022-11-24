import { Game } from "./game";
import { FieldType } from "./model/FieldType";
import { IHistory } from "./model/IHistory";
import { AlgorithmPlayer } from "./player/algorithm-player";
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
    console.table({ TotalGames: episodes, [g.FirstPlayer.Name]: g.FirstPlayer.GameSore, [g.SecondPlayer.Name]: g.SecondPlayer.GameSore });
    console.table({ TotalGames: episodes, [g.FirstPlayer.Name]: (g.FirstPlayer.GameSore / episodes * 100).toFixed(2) + ' %', [g.SecondPlayer.Name]: (g.SecondPlayer.GameSore / episodes * 100).toFixed(2) + ' %' });
}

function printResult(g: Game, episodes: number) {
    console.log(`Player ${g.GameWinner?.Name} won!`);
    printField(g.GameField);
    printScore(g, episodes);
}

export function start(p1: AlgorithmPlayer, p2: RandomPlayer, episodes: number) {
    const g = new Game(p1, p2);

    const history: IHistory = {
        score: [],
        move: []
    };
    
    for (let i = 0; i < episodes; i++) {
        while (g.GameIsStillRunning) {
            g.takeTurn();
        }

        history.score.push(g.GameWinner?.Name === g.FirstPlayer.Name ? 1 : 2);

        g.resetGame();
    }

    printScore(g, episodes);

    history.move = p1.Moves;

    return {
        q: p1.QValue,
        score: {
            p1: g.FirstPlayer.GameSore,
            p2: g.SecondPlayer.GameSore
        },
        history,
    };
}