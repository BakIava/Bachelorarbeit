import { Game } from "./game";
import { FieldType } from "./model/FieldType";
import { GameState } from "./model/GameState";
import { IStatistic } from "./model/IStatistic";
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
    // console.table({ TotalGames: episodes, [g.FirstPlayer.Name]: g.FirstPlayer.GameSore, [g.SecondPlayer.Name]: g.SecondPlayer.GameSore });
    console.table({ TotalGames: episodes, [g.FirstPlayer.Name]: (g.FirstPlayer.GameSore / episodes * 100).toFixed(2) + ' %', [g.SecondPlayer.Name]: (g.SecondPlayer.GameSore / episodes * 100).toFixed(2) + ' %' });
}

function printResult(g: Game, episodes: number) {
    console.log(`Player ${g.GameWinner?.player.Name} won!`);
    printField(g.GameField);
    printScore(g, episodes);
}

export function start(p1: BasePlayer, p2: BasePlayer, episodes: number, allowPlaceMiddle: boolean) {
    const g = new Game(p1, p2, allowPlaceMiddle);

    const statistic: IStatistic = {
        score: {
            p1: {
                move: 0,
                place: 0
            },
            p2: {
                move: 0,
                place: 0
            },
            history: [],
            turn: []
        },
        started: {
            p1: {
                won: 0,
                lost: 0
            },
            p2: {
                won: 0,
                lost: 0
            }
        },
        notstarted: {
            p1: {
                won: 0,
                lost: 0
            },
            p2: {
                won: 0,
                lost: 0
            }
        },
    };

    for (let i = 0; i < episodes; i++) {
        const startPlayer: 'p1' | 'p2' = g.PlayerTurn === p1 ? 'p1' : 'p2';
        while (g.GameIsStillRunning) {
            g.takeTurn();
        }

        if (startPlayer === "p1") {
            if (g.GameWinner?.player === p1) { statistic.started.p1.won++; statistic.notstarted.p2.lost++; }
            else { statistic.started.p1.lost++; statistic.notstarted.p2.won++; }
        }
        else {
            if (g.GameWinner?.player === p2) { statistic.started.p2.won++; statistic.notstarted.p1.lost++; }
            else { statistic.started.p2.lost++; statistic.notstarted.p1.won++; }
        }

        if (g.GameWinner?.player === p1) {
            if (g.GameWinner.state === GameState.PLACE_PHASE) statistic.score.p1.place++;
            else statistic.score.p1.move++;

            statistic.score.history.push(1)
        }
        else {
            if (g.GameWinner?.state === GameState.PLACE_PHASE) statistic.score.p2.place++;
            else statistic.score.p2.move++;

            statistic.score.history.push(2)
        }

        statistic.score.turn.push(g.GameTurnCount);

        g.resetGame();
    }

    printScore(g, episodes);

    const q = {
        p1: null as any,
        p2: null as any
    };


    if (p1 instanceof AlgorithmPlayer) {
        statistic.move = {
            p1Moves: p1.Moves
        };

        q.p1 = p1.QValue;
    }

    if (p2 instanceof AlgorithmPlayer) {
        statistic.move = {
            p1Moves: statistic.move?.p1Moves,
            p2Moves: p2.Moves
        };

        q.p2 = p2.QValue;
    }

    return {
        q,
        score: {
            p1: g.FirstPlayer.GameSore,
            p2: g.SecondPlayer.GameSore
        },
        statistic,
    };
}