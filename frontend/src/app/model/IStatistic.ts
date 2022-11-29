export interface IStatistic {
    score: {
        p1: {
            place: number,
            move: number
        },
        p2: {
            place: number,
            move: number
        },
        history: number[],
        turn: number[]
    },
    started: {
        p1: {
            won: number,
            lost: number
        },
        p2: {
            won: number,
            lost: number
        },
    },
    notstarted: {
        p1: {
            won: number,
            lost: number
        },
        p2: {
            won: number,
            lost: number
        },
    },
    move?: {
        p1Moves?: {
            state: string,
            action: number | { action: number, row: number, col: number }
        }[],
        p2Moves?: {
            state: string,
            action: number | { action: number, row: number, col: number }
        }[]
    }
}