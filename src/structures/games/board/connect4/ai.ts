import { Player, Connect4Game } from './game';

export const enum Difficulty {
    Easy = 2,
    Medium = 4,
    Hard = 8
};

const connect4 = new Connect4Game();

export default class ConnectFourAI {
    protected _difficulty: Difficulty;
    constructor(difficulty: Difficulty) {
        this._difficulty = difficulty;
    };

    /**
     * Get a position to place at
     * @param board - Current Game board
     * @returns {number}
     */
    public getMove(board: Array<Array<Player>>): number {
        return this._minimax(board, this._difficulty, -Infinity, Infinity, true)[0]!;
    };

    /**
     * @protected
     * Get a list of valid columns where a piece can be dropped
     * @param {Player[][]} board - The current game board
     * @returns {Array<number>} - List of valid column indices (0-based)
     */
    protected _emptySpots(board: Player[][]): Array<number> {
        const validLocations = [];
        for(let i = 0; i < Connect4Game.COLS; i++) {
            if(board[0][i] === Player.None) validLocations.push(i);
        };
        return validLocations;
    };
    /**
     * @protected
     * Drop a piece into the specified column
     * @param {Player[][]} board - The current game board
     * @param {Player} player - The player making the move
     * @param {number} column - The column (1-based) to drop the piece into
     * @returns {Player[][]} - The new game board after the move
     */
    protected _dropPiece(board: Player[][], player: Player, column: number): Player[][] {
        const newBoard = board.map(row => [...row]);
        const index = column;
        
        for(let row = Connect4Game.ROWS - 1; row >= 0; row--) {
            if(newBoard[row][index] === Player.None) {
                newBoard[row][index] = player;
                break;
            };
        };
        return newBoard;
    };
    /**
     * @protected
     * Evaluate a diagonal sequence of pieces for scoring purposes
     * @param {Player[]} diagnolPieces - An array representing diagonal pieces
     * @param {Player} player - The player to evaluate
     * @returns {number} - The score for this diagonal sequence
     */
    protected _evaluateDiagnol(diagnolPieces: Player[], player: Player): number {
        let score = 0, playerPieces = 0, emptySpaces = 0, opponentPieces = 0;
        const opponent = (player === Player.Second) ? Player.First : Player.Second;

        for(const p of diagnolPieces) {
            if(p === player) playerPieces++;
            else if(p === Player.None) emptySpaces++;
            else if(p === opponent) opponentPieces++;
        };

        if(playerPieces === 4) score += 99999;
        else if(playerPieces === 3 && emptySpaces === 1) score += 100;
        else if(playerPieces === 2 && emptySpaces === 2) score += 10;

        return score;
    };
    /**
     * @protected
     * Evaluate the board state and return a heuristic score
     * @param {Player[][]} board - The current game board
     * @param {Player} player - The player to evaluate the score for
     * @returns {number} - The heuristic score of the board
     */
    protected _heuristicScore(board: Player[][], player: Player): number {
        let score = 0;
        // Give more weight to center columns
        for(let col = 2; col < 5; col++) {
            for(let row = 0; row < Connect4Game.ROWS; row++) {
                if(board[row][col] === player) score += (col === 3) ? 3 : 2;
            };
        };
        // Horizontal pieces
        for(let col = 0; col < Connect4Game.COLS - Connect4Game.MAX_SPACE; col++) {
            for(let row = 0; row < Connect4Game.ROWS; row++) {
                const adjacentPieces = [
                    board[row][col], board[row][col + 1],
                    board[row][col + 2], board[row][col + 3]
                ];
                score += this._evaluateDiagnol(adjacentPieces, player);
            };
        };
        // Vertical pieces
        for(let col = 0; col < Connect4Game.COLS; col++) {
            for(let row = 0; row < Connect4Game.ROWS - Connect4Game.MAX_SPACE; row++) {
                const adjacentPieces = [
                    board[row][col], board[row + 1][col],
                    board[row + 2][col], board[row + 3][col]
                ];
                score += this._evaluateDiagnol(adjacentPieces, player);
            };
        };
        // Diagonal upwards pieces
        for(let col = 0; col < Connect4Game.COLS - Connect4Game.MAX_SPACE; col++) {
            for(let row = 0; row < Connect4Game.ROWS - Connect4Game.MAX_SPACE; row++) {
                const adjacentPieces = [
                    board[row][col], board[row + 1][col + 1],
                    board[row + 2][col + 2], board[row + 3][col + 3]
                ];
                score += this._evaluateDiagnol(adjacentPieces, player);
            };
        };
        // Diagonal downwards pieces
        for(let col = 0; col < Connect4Game.COLS - Connect4Game.MAX_SPACE; col++) {
            for(let row = Connect4Game.MAX_SPACE; row < Connect4Game.ROWS; row++) {
                const adjacentPieces = [
                    board[row][col], board[row - 1][col + 1],
                    board[row - 2][col + 2], board[row - 3][col + 3]
                ];
                score += this._evaluateDiagnol(adjacentPieces, player);
            };
        };
        return score;
    };
    /**
     * @protected
     * Minimax algorithm with alpha-beta pruning for finding the best move
     * @param {Player[][]} board - The current game board
     * @param {number} depth - The depth of the minimax search
     * @param {number} alpha - The best already explored option along the path for the maximizer
     * @param {number} beta - The best already explored option along the path for the minimizer
     * @param {boolean} maximize - Whether to maximize or minimize the score
     * @returns {[number | null, number]} - Best column choice and corresponding score
     */
    protected _minimax(board: Player[][], depth: number, alpha: number, beta: number, maximize: boolean): [number | null, number] {
        const validColumns = this._emptySpots(board);
        const firstWin = connect4.checkWin(board, Player.First);
        const secondWin = connect4.checkWin(board, Player.Second);
        const isTerminal = firstWin || secondWin || validColumns.length === 0;
    
        if(depth === 0 || isTerminal) {
            if(isTerminal) {
                if(firstWin) return [null, -1000000000];
                if(secondWin) return [null, 1000000000];
                return [null, 0];
            };
            return [null, this._heuristicScore(board, Player.Second)];
        };
    
        const player = !maximize ? Player.First : Player.Second;

        let bestValue = maximize ? -Infinity : Infinity;
        let bestCol = validColumns[Math.floor(Math.random() * validColumns.length)];
    
        for(const column of validColumns) {
            const nextBoard = this._dropPiece(board, player, column);
            const newScore = this._minimax(nextBoard, depth - 1, alpha, beta, !maximize)[1];
            
            if(maximize && newScore > bestValue) {
                bestValue = newScore;
                bestCol = column;
            } else if(!maximize && newScore < bestValue) {
                bestValue = newScore;
                bestCol = column;
            };
    
            if(maximize) alpha = Math.max(alpha, bestValue);
            else beta = Math.min(beta, bestValue);
    
            if(beta <= alpha) break;
        };
        
        return [bestCol, bestValue];
    };
};