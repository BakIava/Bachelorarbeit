import express, { Request, Response } from "express";
import cors from "cors";
import { start } from "./main";
import bodyParser from "body-parser";
import { RandomPlayer } from "./player/random-player";
import { BasePlayer } from "./player/base-player";
import { AlgorithmPlayer } from "./player/algorithm-player";
// import { AlgorithmPlayer } from "./player/algorithm-player";

const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());

app.post('/start', (req: Request, res: Response) => {
    console.log('==================');
    console.log((new Date()).toLocaleTimeString() + ' Start Game Request');

    const config = req.body.config;
    if (!config || !config.p1 || !config.p2 || !config.options) { res.status(400).send(); return; }

    const shellCount = config.options.shells;
    const episodes = config.options.episodes;

    let p1: BasePlayer;
    let p2: BasePlayer;

    if (config.p1.player === 0) {
        console.log((new Date()).toLocaleTimeString() + ' First Player: Algorithm');
        p1 = new AlgorithmPlayer(config.p1.name, shellCount, config.p1.configuration);
    } else {
        console.log((new Date()).toLocaleTimeString() + ' First Player: Random');
        p1 = new RandomPlayer(config.p1.name, shellCount);
    }

    if (config.p2.player === 0) {
        console.log((new Date()).toLocaleTimeString() + ' Second Player: Algorithm');
        p2 = new AlgorithmPlayer(config.p2.name, shellCount, config.p2.configuration);
    } else {
        console.log((new Date()).toLocaleTimeString() + ' First Player: Random');
        p2 = new RandomPlayer(config.p2.name, shellCount);
    }

    if (!p1 || !p2) { res.status(400).send(); return; }

    console.log('==================');
    console.log((new Date()).toLocaleTimeString() + ' Here we go');
    const result = start(p1, p2, episodes, shellCount);

    res.status(200).send(result);
});

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});