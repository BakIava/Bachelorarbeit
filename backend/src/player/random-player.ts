import { IField } from "../game";
import { Action } from "../model/Action";
import { FieldType } from "../model/FieldType";
import { IStone } from "../model/IStone";
import { BasePlayer } from "./base-player";

export class RandomPlayer extends BasePlayer {

    constructor(name: string, shellCount: number) {
        super("random-player-" + name, shellCount)
    }

    choosePlaceAction(field: IField) {
        const max = field.shells.length * 8;
        const random = Math.round(Math.random() * max);
        const shellIndex = Math.ceil(random / 8) - 1;
        const pointIndex = random - (shellIndex * 8) - 1

        return {
            pos: {
                core: random === 0,
                shell: random === 0 ? undefined : shellIndex,
                point: random === 0 ? undefined : pointIndex,
            },
            callback: null
        }
    }

    chooseMoveAction(field: IField) {
        const moves = [];

        if (field.core.fill?.player === this) {
            const actions = [];

            for (const connection of field.core.connections) {
                if (connection.core && field.core.fill === null) {
                    actions.push(connection);
                } else if (!connection.core && field
                    .shells[connection.shell as number]
                    .points[connection.point as number]
                    .fill === null) actions.push(connection);
            }

            if (actions.length > 0) moves.push({ core: true, actions });
        }

        for (let i = 0; i < field.shells.length; i++) {
            for (let j = 0; j < field.shells[i].points.length; j++) {
                if (field.shells[i].points[j].fill?.player === this) {
                    const actions = [];

                    for (const connection of field.shells[i].points[j].connections) {
                        if (connection.core && field.core.fill === null) {
                            actions.push(connection);
                        } else if (!connection.core && field
                            .shells[connection.shell as number]
                            .points[connection.point as number]
                            .fill === null) actions.push(connection);
                    }

                    if (actions.length > 0) moves.push({ shell: i, point: j, actions });
                }
            }
        }

        const randomMove = moves[Math.round(Math.random() * (moves.length - 1))];
        if (randomMove === undefined) {
            console.log(moves);
            console.log('core connections');

            for (let i = 0; i < field.core.connections.length; i++) {
                console.log(field.core.connections[i]);
            }

            console.log('core fill');

            console.log(field.core.fill?.player.Name);
            console.log(this.Name);


            console.log('shells');

            for (let i = 0; i < field.shells.length; i++) {
                console.log('shell ' + i + ' points');

                for (let j = 0; j < field.shells[i].points.length; j++) {
                    console.log(field.shells[i].points[j]);
                    console.log(field.shells[i].points[j].fill?.player.Name);
                }
            }

            // console.log(field);            
        }
        const randomAction = randomMove.actions[Math.round(Math.random() * (randomMove.actions.length - 1))];

        return {
            pos: { core: randomMove.core, shell: randomMove.shell, point: randomMove.point },
            action: randomAction.action,
            callback: null
        };
    }
}