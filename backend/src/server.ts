import express, { Request, Response } from "express";
import cors from "cors";
import { start } from "./main";
import bodyParser from "body-parser";
import { RandomPlayer } from "./player/random-player";
import { BasePlayer } from "./player/base-player";
import { AlgorithmPlayer } from "./player/algorithm-player";
import fs from 'fs';

const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());

let sarsaEasyWithMiddle: AlgorithmPlayer;
let sarsaEasy: AlgorithmPlayer;
let sarsaMediumWithMiddle: AlgorithmPlayer;
let sarsaMedium: AlgorithmPlayer;
let sarsaHardWithMiddle: AlgorithmPlayer;
let sarsaHard: AlgorithmPlayer;

function createSarsaTrainingPuppets() {
    let episodesEasy = 1000;
    let episodesMeduim = 10000;
    let episodesHard = 50000;
    const config = { Alpha: 0.5, Epsilon: 0.2, Gamma: 0.95, GoalReward: 1, Random: false, Reward: -0.01 }
    const allowPlaceMiddle = false;

    sarsaEasyWithMiddle = new AlgorithmPlayer('1', 'SARSA-EASY-MIDDLE', config, !allowPlaceMiddle);
    sarsaEasy = new AlgorithmPlayer('1', 'SARSA-EASY', config, allowPlaceMiddle);
    sarsaMediumWithMiddle = new AlgorithmPlayer('1', 'SARSA-MEDIUM-MIDDLE', config, !allowPlaceMiddle);
    sarsaMedium = new AlgorithmPlayer('1', 'SARSA-MEDIUM', config, allowPlaceMiddle);
    sarsaHardWithMiddle = new AlgorithmPlayer('1', 'SARSA-HARD-MIDDLE', config, !allowPlaceMiddle);
    sarsaHard = new AlgorithmPlayer('1', 'SARSA-HARD', config, allowPlaceMiddle);
    const random = new RandomPlayer('2');

    start(sarsaEasyWithMiddle, random, episodesEasy, !allowPlaceMiddle);
    start(sarsaEasy, random, episodesEasy, allowPlaceMiddle);
    start(sarsaMediumWithMiddle, random, episodesMeduim, !allowPlaceMiddle);
    start(sarsaMedium, random, episodesMeduim, allowPlaceMiddle);
    start(sarsaHardWithMiddle, random, episodesHard, !allowPlaceMiddle);
    start(sarsaHard, random, episodesHard, allowPlaceMiddle);

    sarsaEasyWithMiddle.EnableTrainingPuppetMode();
    sarsaEasyWithMiddle.ResetMoves();
    sarsaEasy.EnableTrainingPuppetMode();
    sarsaEasy.ResetMoves();

    sarsaMediumWithMiddle.EnableTrainingPuppetMode();
    sarsaMediumWithMiddle.ResetMoves();
    sarsaMedium.EnableTrainingPuppetMode();
    sarsaMedium.ResetMoves();

    sarsaHardWithMiddle.EnableTrainingPuppetMode();
    sarsaHardWithMiddle.ResetMoves();
    sarsaHard.EnableTrainingPuppetMode();
    sarsaHard.ResetMoves();
}

function retrainSarsaTrainingPuppet(level: 1 | 2 | 3, allowPlaceMiddle: boolean, episodes: number,
    config: {
        Alpha: number,
        Epsilon: number,
        Gamma: number,
        GoalReward: number,
        Random: boolean,
        Reward: number
    }) {

    let algorithm!: AlgorithmPlayer;
    const random = new RandomPlayer('2');

    switch (level) {
        case 1:
            if (allowPlaceMiddle) {
                sarsaEasyWithMiddle = new AlgorithmPlayer('1', 'SARSA-EASY-MIDDLE', config, allowPlaceMiddle);
                algorithm = sarsaEasyWithMiddle;
            } else {
                sarsaEasy = new AlgorithmPlayer('1', 'SARSA-EASY', config, allowPlaceMiddle);
                algorithm = sarsaEasy;
            }
        case 2:
            if (allowPlaceMiddle) {
                sarsaMediumWithMiddle = new AlgorithmPlayer('1', 'SARSA-MEDIUM-MIDDLE', config, allowPlaceMiddle);
                algorithm = sarsaMediumWithMiddle;
            } else {
                sarsaMedium = new AlgorithmPlayer('1', 'SARSA-MEDIUM', config, allowPlaceMiddle);
                algorithm = sarsaMedium;
            }
        case 3:
            if (allowPlaceMiddle) {
                sarsaHardWithMiddle = new AlgorithmPlayer('1', 'SARSA-HARD-MIDDLE', config, allowPlaceMiddle);
                algorithm = sarsaHardWithMiddle;
            } else {
                sarsaHard = new AlgorithmPlayer('1', 'SARSA-HARD', config, allowPlaceMiddle);
                algorithm = sarsaHard;
            }
    }

    start(algorithm, random, episodes, allowPlaceMiddle);
    algorithm.EnableTrainingPuppetMode();
    algorithm.ResetMoves();
}

function getSarsaTrainingPuppet(level: 1 | 2 | 3, allowPlaceMiddle: boolean, epsilon: number): AlgorithmPlayer {
    let puppet: AlgorithmPlayer;

    switch (level) {
        case 1:
            if (allowPlaceMiddle) {
                console.log((new Date()).toLocaleTimeString() + ' SARSA Training Puppet - Easy (with middle)');
                sarsaEasyWithMiddle.UpdateEpsilon(epsilon);
                sarsaEasyWithMiddle.ResetMoves();
                sarsaEasyWithMiddle.resetScore();
                puppet = sarsaEasyWithMiddle;
            } else {
                console.log((new Date()).toLocaleTimeString() + ' SARSA Training Puppet - Easy');
                sarsaEasy.UpdateEpsilon(epsilon);
                sarsaEasy.ResetMoves();
                sarsaEasy.resetScore();
                puppet = sarsaEasy;
            }
        case 2:
            if (allowPlaceMiddle) {
                console.log((new Date()).toLocaleTimeString() + ' SARSA Training Puppet - Medium (with middle)');
                sarsaMediumWithMiddle.UpdateEpsilon(epsilon);
                sarsaMediumWithMiddle.ResetMoves();
                sarsaMediumWithMiddle.resetScore();
                puppet = sarsaEasyWithMiddle;
            } else {
                console.log((new Date()).toLocaleTimeString() + ' SARSA Training Puppet - Medium');
                sarsaMedium.UpdateEpsilon(epsilon);
                sarsaMedium.ResetMoves();
                sarsaMedium.resetScore();
                puppet = sarsaMedium;
            }
        case 3:
            if (allowPlaceMiddle) {
                console.log((new Date()).toLocaleTimeString() + ' SARSA Training Puppet - Hard (with middle)');
                sarsaHardWithMiddle.UpdateEpsilon(epsilon);
                sarsaHardWithMiddle.ResetMoves();
                sarsaHardWithMiddle.resetScore();
                puppet = sarsaHardWithMiddle;
            } else {
                console.log((new Date()).toLocaleTimeString() + ' SARSA Training Puppet - Hard');
                sarsaHard.UpdateEpsilon(epsilon);
                sarsaHard.ResetMoves();
                sarsaHard.resetScore();
                puppet = sarsaHard;
            }
    }

    return puppet;
}

app.post('/retrain', (req: Request, res: Response) => {
    const config = req.body.config;
    if (!config) { res.status(400).send(); return; }
    retrainSarsaTrainingPuppet(config.Puppet, config.AllowPlaceMiddle, config.Episodes, {
        Alpha: config.Alpha,
        Epsilon: config.Epsilon,
        Gamma: config.Gamma,
        GoalReward: config.GoalReward,
        Random: config.Random,
        Reward: config.Reward
    });

    res.status(200).send();
});

app.post('/start', (req: Request, res: Response) => {
    const config = req.body.config;
    if (!config || !config.p1 || !config.p2 || !config.options) { res.status(400).send(); return; }

    console.log('================');
    console.log((new Date()).toLocaleTimeString() + ' Start Game Request');

    const episodes = config.options.episodes;
    const allowPlaceMiddle = config.options.allowPlaceMiddle;

    console.log((new Date()).toLocaleTimeString() + ' Episodes: ' + episodes);
    console.log((new Date()).toLocaleTimeString() + ' AllowPlaceMiddle: ' + allowPlaceMiddle);

    let p1: BasePlayer;
    let p2: BasePlayer;

    if (config.p1.player === 0) {
        console.log((new Date()).toLocaleTimeString() + ' SARSA Algorithm');
        p1 = new AlgorithmPlayer('1', config.p1.name, config.p1.configuration, allowPlaceMiddle);
    } else if (config.p1.player === 1 || config.p1.player === 2 || config.p1.player === 3) {
        p1 = getSarsaTrainingPuppet(config.p1.player, allowPlaceMiddle, config.p1.configuration.Epsilon);
    } else {
        console.log((new Date()).toLocaleTimeString() + ' RandomPlayer');
        p1 = new RandomPlayer(config.p1.name);
    }

    if (config.p2.player === 0) {
        console.log((new Date()).toLocaleTimeString() + ' SARSA Algorithm');
        p2 = new AlgorithmPlayer('2', config.p2.name, config.p2.configuration, allowPlaceMiddle);
    } else if (config.p2.player === 1 || config.p2.player === 2 || config.p2.player === 3) {
        p2 = getSarsaTrainingPuppet(config.p2.player, allowPlaceMiddle, config.p2.configuration.Epsilon);
    } else {
        console.log((new Date()).toLocaleTimeString() + ' SecondPlayer: RandomPlayer');
        p2 = new RandomPlayer(config.p2.name);
    }

    if (!p1 || !p2) { res.status(400).send(); return; }

    console.log('==================');
    console.log((new Date()).toLocaleTimeString() + ' Here we go');
    const result = start(p1, p2, episodes, allowPlaceMiddle);

    res.status(200).send(result);
});

createSarsaTrainingPuppets();

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});