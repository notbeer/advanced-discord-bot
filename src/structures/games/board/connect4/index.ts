import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    User
} from "discord.js";

import { MainBase, Player } from "../indexBase";
import { Connect4Game } from "./game";

import AI, { Difficulty } from "./ai";

export default class Connect4 extends MainBase<Connect4Game>{
    constructor(p1: User, p2: User, difficulty?: Difficulty) {
        super(p1, p2, new Connect4Game(), typeof difficulty !== 'undefined' ? new AI(difficulty) : undefined);
    };

    protected _renderButtons() {
        const buttons = Array.from({ length: 7 }, (_, i) =>
            new ButtonBuilder()
                .setDisabled(this._game.winner !== Player.None)
                .setCustomId(`${i}`)
                .setLabel(`${i + 1}`)
                .setStyle(ButtonStyle.Secondary)
        );
    
        return [
            new ActionRowBuilder<ButtonBuilder>().setComponents(...buttons.slice(0, 4)),
            new ActionRowBuilder<ButtonBuilder>().setComponents(...buttons.slice(-3))
        ];
    };    

    protected _extraMessageStatus() {
        let board = "\n|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|\n\n"
        for (let x = 0; x < Connect4Game.ROWS; x++) {
            for (let y = 0; y < Connect4Game.COLS; y++) {
                const player = this._game.board[x][y];

                const lastMove = this._game.lastMove?.col === y && this._game.lastMove?.row === x;
                const isWinningMove = this._game.winningPos.some(pos => pos.col === y && pos.row === x);

                board += "|" + (player === Player.None ? '⚪' : this._game.playerSign(player, lastMove || isWinningMove));
            };
            board += "|\n";
        };
        return board;
    };
};