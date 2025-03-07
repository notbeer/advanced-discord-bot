import { GameBase, Player } from "../gameBase";

export default class TicTacToeGame extends GameBase {
    constructor() {
        super();
        this._board = new Array(9).fill(Player.None);
    };
    /**
     * @protected
     * Player one's sign
     */
    protected p1sign = 'X';
    /**
     * @protected
     * Player two's sign
     */
    protected p2sign = 'O';

    /**
     * @public
     * Check if the TicTacToe board is full
     * @return {boolean}
     */
    public get isBoardFull(): boolean {
        return this.board.every(v => v !== Player.None);
    };
    /**
     * @public
     * Get 'X' or 'O' depending on the player
     * @param {Player} player - Player sign to get
     * @returns {string}
     */
    public playerSign(player: Player): string {
        return player === Player.First ? this.p1sign : this.p2sign;
    }
    /**
     * @public
     * Check if a player has won in the current round
     * @param {Array<Player> | Array<string | number>} board - Board to check if a player has a won
     * @param player - The player to check if they won
     * @returns {boolean}
     */
    public checkWin(board: Array<Player> | Array<string | number>, player: Player | string): boolean {
        const combos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows -
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns | 
            [0, 4, 8], [2, 4, 6]             //  Diagonals \/
        ];

        return combos.some(([a, b, c]) => board[a] === player && board[b] === player && board[c] === player);
    };
    /**
     * @public
     * Update the TicTacToe board data. Set a winner if someone won or move onto the next players turn
     * @param {number} position - Position to update on the TicTacToe board
     * @return {void}
     */
    public updateBoard(position: number): void {
        this._board[position] = this.currentPlayer;
        this._winner = this.checkWin(this.board, this.currentPlayer) ? this.currentPlayer : Player.None;
        if(this.winner === Player.None) this._currentPlayer = this.currentPlayer === Player.First ? Player.Second : Player.First;
    };
};

export { Player };