import express, { Request, Response } from "express";
import cors from "cors";
import { start } from "./main";
import bodyParser from "body-parser";
import { RandomPlayer } from "./player/random-player";
import { BasePlayer } from "./player/base-player";
import { AlgorithmPlayer } from "./player/algorithm-player";

const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());

app.post('/start', (req: Request, res: Response) => {
    const config = req.body.config;
    if (!config || !config.p1 || !config.p2 || !config.options) { res.status(400).send(); return; }

    let p1: AlgorithmPlayer = new AlgorithmPlayer('1', config.p1.configuration);
    let p2 = new RandomPlayer('2');
    const episodes = config.options.episodes;

    if (!p1 || !p2) { res.status(400).send(); return; }

    const result = start(p1, p2, episodes);

    res.status(200).send(result);
});

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});