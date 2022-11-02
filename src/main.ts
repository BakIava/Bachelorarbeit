import { Game } from "./game";
import { FieldType } from "./model/FieldType";
import { AlgorithmPlayer } from "./player/algorithm-player";
import { RandomPlayer } from "./player/random-player";

const EPISODES = 1000000;

function printField(field: FieldType[][]) {
    const print = [['', '', ''], ['', '', ''], ['', '', '']];

    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[i].length; j++) {
            if (field[i][j] !== null) print[i][j] = field[i][j]!.player.Name;
        }
    }

    console.table(print);
}

function printScore(g: Game) {
    console.table({ TotalGames: EPISODES, [g.FirstPlayer.Name]: g.FirstPlayer.GameSore, [g.SecondPlayer.Name]: g.SecondPlayer.GameSore });
    console.table({ TotalGames: EPISODES, [g.FirstPlayer.Name]: (g.FirstPlayer.GameSore / EPISODES * 100).toFixed(2) + ' %', [g.SecondPlayer.Name]: (g.SecondPlayer.GameSore / EPISODES * 100).toFixed(2) + ' %' });
}

function printResult(g: Game) {
    console.log(`Player ${g.GameWinner?.Name} won!`);
    printField(g.GameField);
    printScore(g);
}

function main() {
    const sarsa = new AlgorithmPlayer("SARSA");
    const g = new Game(sarsa, new RandomPlayer("2"));

    for (let i = 0; i < EPISODES; i++) {
        while (g.GameIsStillRunning) {
            // printField(g.GameField);
            g.takeTurn();
        }

        // printResult(g)       
        g.resetGame();
    }

    printScore(g);
}

main();