export const enum Player {
    None,
    First,
    Second
};

export abstract class GameBase {
    /**
     * @protected
     * Game name
     */
    protected abstract _name: string;
    /**
     * @protected
     * Board data
     */
    protected abstract _board: Array<Player> | Player[][];
    /**
     * @protected
     * Player ones sign
     */
    protected abstract p1sign: string;
    /**
     * @protected
     * Player twos sign
     */
    protected abstract p2sign: string;

    /**
     * @protected
     * Player that has to choose a move
     */
    protected _currentPlayer = Math.random() < 0.5 ? Player.First : Player.Second;
    /**
     * @protected
     * Winner of the round
     */
    protected _winner = Player.None;

    /**
     * @public
     * Get game name
     * @return {string}
     */
    public get name(): string {
        return this._name;
    };
    /**
     * @public
     * Get board data
     * @return {Array<any>}
     */
    public get board(): Array<any> {
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
     * Check if the board is full
     * @return {boolean}
     */
    public abstract get isBoardFull(): boolean;
    /**
     * @public
     * Get the players board sign
     * @param {Player} player - Player's sign to get
     * @returns {string}
     */
    public abstract playerSign(player: Player): string;
    public abstract playerSign(player: Player, square?: boolean): string;
    /**
     * @public
     * Check if a player has won in the board
     * @param {Array<any>} board - Board to check
     * @param player - The player to check if they won
     * @returns {boolean}
     */
    public abstract checkWin(board: Array<any>, player: Player): boolean;
    /**
     * @public
     * Update the board with Player enum
     * @param {number} position - Position to place in board
     * @return {void}
     */
    public abstract updateBoard(position: number): void;
};