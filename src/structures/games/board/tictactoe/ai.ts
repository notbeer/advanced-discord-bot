import TicTacToeGame, { Player } from "./game";

interface MoveData {
    index?: number,
    score: number
};
export const enum Difficulty {
    Easy = 0.7,
    Medium = 0.3,
    Impossible = 0
};

const game = new TicTacToeGame();

export default class TicTacToeAI {
    protected _difficulty: Difficulty;
    constructor(difficulty: Difficulty) {
        this._difficulty = difficulty;
    };

    /**
     * Get a position to place at
     * @param board - Current Game board
     * @returns {number}
     */
    public getMove(board: Array<Player>): number {
        return Math.random() > this._difficulty
            ? this._minimax(board, Player.Second).index!
            : this._emptySpots(board, true);
    };

    protected _emptySpots(board: Array<string | number>): Array<number>
    protected _emptySpots(board: Array<string | number>, random: boolean): number
    /**
     * @protected
     * Find one or multiple empty spots in the TicTacToe board
     * @param {Array<string | number>} board  - Current Game board
     * @param random - Option to pick a random empty spot
     * @returns {Array<number> | number}
     */
    protected _emptySpots(board: Array<Player>, random?: boolean): Array<number> | number {
        const filtered = board.map((value, index) => value === Player.None ? index : -1).filter(index => index !== -1);
        return random ? filtered[Math.floor(Math.random() * filtered.length)] : filtered;
    };
    /**
     * @protected
     * Minimax algorithim
     * @param {Array<number | string>} board - Current Game board
     * @param {string} player - The Player enum
     * @returns {MoveData}
     */
    protected _minimax(board: Array<Player>, player: Player): MoveData {
        const availableSpots = this._emptySpots(board) as number[];
    
        if(game.checkWin(board, Player.First)) return { score: -1 };
        else if(game.checkWin(board, Player.Second)) return { score: 1 };
        else if(availableSpots.length === 0) return { score: 0 };
    
        const allTestMoves: Array<MoveData> = [];
        
        for(let i = 0; i < availableSpots.length; i++) {
            const move: MoveData = { index: availableSpots[i], score: 0 };
            board[availableSpots[i]] = player;
    
            if(player === Player.Second) {
                if(game.checkWin(board, Player.Second)) {
                    move.score = 1;
                    board[availableSpots[i]] = Player.None;
                    return move;
                }
                const result = this._minimax(board, Player.First);
                move.score = result.score;
            } else {
                const result = this._minimax(board, Player.Second);
                move.score = result.score;
            };
    
            board[availableSpots[i]] = Player.None;
            allTestMoves.push(move);
        };
    
        let bestMove = 0;
    
        if(player === Player.Second) {
            let bestScore = -Infinity;
            for(let i = 0; i < allTestMoves.length; i++) {
                if(allTestMoves[i].score > bestScore) {
                    bestScore = allTestMoves[i].score;
                    bestMove = i;
                };
            };
        } else {
            let bestScore = Infinity;
            for(let i = 0; i < allTestMoves.length; i++) {
                if(allTestMoves[i].score < bestScore) {
                    bestScore = allTestMoves[i].score;
                    bestMove = i;
                };
            };
        };
        return allTestMoves[bestMove];
    };
};