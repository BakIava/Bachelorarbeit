import { Game } from "./game";
import { FieldType } from "./model/FieldType";
import { AlgorithmPlayer } from "./player/algorithm-player";
import { RandomPlayer } from "./player/random-player";

const EPISODES = 1000;

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
    console.log(`Score ${g.FirstPlayer.GameSore}:${g.SecondPlayer.GameSore}`);
}

function printResult(g: Game) {
    console.log(`Player ${g.GameWinner?.Name} won!`);
    printField(g.GameField);
    printScore(g);
}

function main() {
    const g = new Game(new AlgorithmPlayer("SARSA"), new RandomPlayer("2"));

    for (let i = 0; i < EPISODES; i++) {
        while (g.GameIsStillRunning) {
            printField(g.GameField);
            g.takeTurn();
        }

        // printResult(g);

        g.resetGame();
    }

    printScore(g);
}

main();