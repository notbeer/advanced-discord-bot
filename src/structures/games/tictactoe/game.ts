export const enum Player {
    None,
    First,
    Second
};

export class Game {
    /**
     * @private
     * TicTacToe board data
     */
    private _board: Array<Player> = new Array(9).fill(Player.None);
    /**
     * @private
     * Player that has to choose a move
     */
    private _currentPlayer = Math.random() < 0.5 ? Player.First : Player.Second;
    /**
     * @private
     * Winner of the round
     */
    private _winner = Player.None;
    /**
     * @public
     * Player ones sign
     */
    public p1sign = 'X';
    /**
     * @public
     * Player twos sign
     */
    public p2sign = 'O';
    /**
     * @public
     * Get TicTacToe board data
     * @return {Array<Player>}
     */
    public get board(): Array<Player> {
        return this._board;
    };
    /**
     * @public
     * Get the current player
     * @return {Player}
     */
    public get currentPlayer(): Player {
        return this._currentPlayer;
    };
    /**
     * @public
     * Get the winner of the round
     * @return {Player}
     */
    public get winner(): Player {
        return this._winner;
    };
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
        return player === Player.First ? this.p1sign : this.p2sign
    };
    /**
     * @public
     * Check if a player has won in the current round
     * @param {Array<Player> | Array<string | number>} board - Board to check if a player has a won
     * @param player - The player to check if they won
     * @returns {boolean}
     */
    public checkWin(board: Array<Player> | Array<string | number>, player: Player | string): boolean {
        const combos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        for(let i = 0; i < combos.length; i++) {
            const [pos1, pos2, pos3] = combos[i];
            if(board[pos1] === player && board[pos1] && board[pos1] === board[pos2] && board[pos1] === board[pos3]) return true;
        };
        return false;
    };
    /**
     * @public
     * Update the TicTacToe board data. Set a winner if someone won or move onto the next players turn
     * @param {number} position - Position to update on the TicTacToe board
     * @return {void}
     */
    public updateGame(position: number): void {
        this._board[position] = this.currentPlayer;
        this._winner = this.checkWin(this.board, this.currentPlayer) ? this.currentPlayer : Player.None;
        if(this.winner === Player.None) this._currentPlayer = this.currentPlayer === Player.First ? Player.Second : Player.First;
    };
    /**
     * @public
     * Covert the board for minimax algorithim
     * @returns {Array<string | number>}
     */
    public convertBoard(): Array<string | number> {
        return this.board.map((v, i) => v === Player.None ? i : this.playerSign(v))
    };
};