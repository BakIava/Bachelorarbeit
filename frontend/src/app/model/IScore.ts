export interface IScore {
    player1: number;
    player2: number;
    history: {
        score: number[],
        move: any[]
    }
}