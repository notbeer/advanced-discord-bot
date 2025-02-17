import { Game } from "./game";

interface MoveData {
    index?: number,
    score: number
}
export default class AI {
    /**
     * @public
     * Find an array of empty spots in the TicTacToe board
     * @param {Array<string | number>} board - The converted TicTacToe board data
     * @return {Array<number>}
     */
    public emptySpots(board: Array<string | number>): Array<number>
    /**
     * @public
     * Find one random empty spot in the TicTacToe board
     * @param {Array<string | number>} board - The converted TicTacToe board data
     * @param {boolean} random - Set true to pick a random empty spot
     * @return {<number>}
     */
    public emptySpots(board: Array<string | number>, random: boolean): number
    /**
     * Find one or multiple empty spots in the TicTacToe board
     * @param {Array<string | number>} board  - The converted TicTacToe board data
     * @param random - Option to pick a random empty spot
     * @returns {Array<number> | number}
     */
    public emptySpots(board: Array<string | number>, random?: boolean): Array<number> | number {
        const filtered = board.filter(index => typeof index === 'number') as Array<number>
        return random ? filtered[Math.floor(Math.random() * filtered.length)] : filtered;
    };
    /**
     * @public
     * AI to play against the user
     * @param {Game} game - Class game constructor
     * @param {Array<number | string>} board - The converted TicTacToe board data
     * @param {string} player - The AIs sign
     * @returns {MoveData}
     */
    public minimax(game: Game, board: Array<number | string>, player: string): MoveData {
        const availableSpots = this.emptySpots(board);

        if(game.checkWin(board, game.p1sign)) return { score: -1 };
        else if(game.checkWin(board, game.p2sign)) return { score: 1 };
        else if(availableSpots.length === 0) return { score: 0 };

        const allTestMoves: Array<MoveData> = [];
        for(let i = 0; i < availableSpots.length; i++) {
            const move: MoveData = { index: 0, score: 0 };
            move.index = board[availableSpots[i]] as number;
            board[availableSpots[i]] = player;

            if(player === game.p2sign) {
                if(game.checkWin(board, game.p2sign)) {
                    move.score = 1;
                    board[availableSpots[i]] = move.index;
                    return move;
                };
                const result = this.minimax(game, board, game.p1sign);
                move.score = result.score;
            } else {
                const result = this.minimax(game, board, game.p2sign);
                move.score = result.score;
            };

            board[availableSpots[i]] = move.index;
            allTestMoves.push(move);
        };

        let bestMove = 0;
        if(player === game.p2sign) {
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