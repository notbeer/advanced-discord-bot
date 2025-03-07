import { GameBase, Player } from "../gameBase";

type LastMove = { col: number, row: number };

export class Connect4Game extends GameBase {
    protected _board: Array<Array<Player>>;
    constructor() {
        super();
        this._board = Array.from({ length: Connect4Game.ROWS }, () => Array(Connect4Game.COLS).fill(Player.None));
    };
    
    /**
     * @public
     * Number of rows and columns in the board
     */
    public static readonly COLS = 7;
    public static readonly ROWS = 6;
    public static readonly MAX_SPACE = 3;
    
    /**
     * @protected
     * Last column placed
     */
    protected _lastMove: null | LastMove = null;
    /**
     * @static
     * Winner of the round
     */
    protected _winningPos: Array<LastMove> = [];
    /**
     * @protected
     * Player one's sign
     */
    protected p1sign = '🔴';
    protected p1sign_square = '🟥';
    /**
     * @protected
     * Player two's sign
     */
    protected p2sign = '🟡';
    protected p2sign_square = '🟨';


    /**
     * @public
     * Get the last move played by the last players
     * @return {null | LastMove}
     */
    public get lastMove(): null | LastMove {
        return this._lastMove;
    };

    /**
     * @public
     * Get the winner of the round
     * @return {Player}
     */
    public get winningPos(): Array<LastMove> {
        return this._winningPos;
    };

    /**
     * @public
     * Check if the Connect4 board is full
     * @return {boolean}
     */
    public get isBoardFull(): boolean {
        return this._board.every(row => row.every(cell => cell !== Player.None));
    };

    /**
     * @public
     * Get Red or Yellow sign depending on the player
     * @param {Player} player - Player sign to get
     * @param {boolean} square - Set to true to return square sign
     * @returns {string}
     */
    public playerSign(player: Player, square?: boolean): string {
        return !square 
               ? player === Player.First ? this.p1sign : this.p2sign
               : player === Player.First ? this.p1sign_square : this.p2sign_square;
    };

    /**
     * @public
     * Drop a piece into a column
     * @param {number} column - Column to drop the piece into
     * @return {boolean} - Whether the move was successful
     */
    public updateBoard(column: number): boolean {
        if(column < 0 || column >= Connect4Game.COLS || this._board[0][column] !== Player.None) return false;

        for(let row = Connect4Game.ROWS - 1; row >= 0; row--) {
            if(this._board[row][column] === Player.None) {
                this._lastMove = { col: column, row: row };
                this._board[row][column] = this._currentPlayer;

                if(this.checkWin(this._board, this._currentPlayer)) this._winner = this._currentPlayer;
                else this._currentPlayer = this._currentPlayer === Player.First ? Player.Second : Player.First;

                return true;
            };
        };

        return false;
    };

    /**
     * @public
     * Check if a player has won in the current round
     * @param {Player[][]} board - Board to check
     * @param {Player} player - The player to check if they won
     * @returns {boolean} - Whether a player wins
     */
    public checkWin(board: Player[][], player: Player): boolean {
        // Horizontal win
        for(let col = 0; col < Connect4Game.COLS - Connect4Game.MAX_SPACE; col++) {
            for(let row = 0; row < Connect4Game.ROWS; row++) {
                if (
                    board[row][col] === player &&
                    board[row][col + 1] === player &&
                    board[row][col + 2] === player &&
                    board[row][col + 3] === player
                ) {
                    this._winningPos = [
                        { row, col },
                        { row, col: col + 1 },
                        { row, col: col + 2 },
                        { row, col: col + 3 }
                    ];
                    return true;
                };
            };
        };
        // Vertical win
        for(let col = 0; col < Connect4Game.COLS; col++) {
            for(let row = 0; row < Connect4Game.ROWS - Connect4Game.MAX_SPACE; row++) {
                if (
                    board[row][col] === player &&
                    board[row + 1][col] === player &&
                    board[row + 2][col] === player &&
                    board[row + 3][col] === player
                ) {
                    this._winningPos = [
                        { row, col },
                        { row: row + 1, col },
                        { row: row + 2, col },
                        { row: row + 3, col }
                    ];
                    return true;
                };
            };
        };
        // Diagonal upwards win
        for(let col = 0; col < Connect4Game.COLS - Connect4Game.MAX_SPACE; col++) {
            for(let row = 0; row < Connect4Game.ROWS - Connect4Game.MAX_SPACE; row++) {
                if (
                    board[row][col] === player &&
                    board[row + 1][col + 1] === player &&
                    board[row + 2][col + 2] === player &&
                    board[row + 3][col + 3] === player
                ) {
                    this._winningPos = [
                        { row, col },
                        { row: row + 1, col: col + 1 },
                        { row: row + 2, col: col + 2 },
                        { row: row + 3, col: col + 3 }
                    ];
                    return true;
                };
            };
        };
        // Diagonal downwards win
        for(let col = 0; col < Connect4Game.COLS - Connect4Game.MAX_SPACE; col++) {
            for(let row = Connect4Game.MAX_SPACE; row < Connect4Game.ROWS; row++) {
                if (
                    board[row][col] === player &&
                    board[row - 1][col + 1] === player &&
                    board[row - 2][col + 2] === player &&
                    board[row - 3][col + 3] === player
                ) {
                    this._winningPos = [
                        { row, col },
                        { row: row - 1, col: col + 1 },
                        { row: row - 2, col: col + 2 },
                        { row: row - 3, col: col + 3 }
                    ];
                    return true;
                };
            };
        };
        return false;
    };
};

export { Player };