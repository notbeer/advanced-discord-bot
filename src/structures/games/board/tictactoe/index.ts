import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    User
} from "discord.js";

import { MainBase, Player } from "../indexBase";
import TicTacToeGame from "./game";

import AI, { Difficulty } from "./ai";

export default class TicTacToe extends MainBase<TicTacToeGame> {
    constructor(p1: User, p2: User, difficulty?: Difficulty) {
        super(p1, p2, new TicTacToeGame(), typeof difficulty !== 'undefined' ? new AI(difficulty) : undefined);
    };

    protected _renderButtons() {
        const actionRow: Array<ActionRowBuilder<ButtonBuilder>> = [];
        for(let i = 0; i < 3; i++) {
            const buttons: Array<ButtonBuilder> = [];
            for(let j = 0; j < 3; j++) {
                const index = i * 3 + j, player = this._game.board[index];
                buttons.push(
                    new ButtonBuilder()
                        .setDisabled(this._game.winner !== Player.None || player !== Player.None)
                        .setCustomId(`${index}`)
                        .setLabel(player === Player.None ? '⠀' : this._game.playerSign(player))
                        .setStyle(
                            player === Player.None 
                            ? ButtonStyle.Secondary
                            : player === Player.First
                                ? ButtonStyle.Success
                                : ButtonStyle.Danger
                        )
                );
            };
            actionRow.push(
                new ActionRowBuilder<ButtonBuilder>()
                    .setComponents(...buttons)
            );
        };
        return actionRow;
    };
};