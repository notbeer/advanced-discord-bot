import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    CommandInteraction,
    InteractionResponse,
    User
} from "discord.js";

import {
    Game,
    Player
} from "./game";
import AI from "./ai";

import i18n from "../../../utils/i18n";

import { sleep } from "../../../utils/promise";

export const enum Difficulty {
    Easy = 0.7,
    Medium = 0.3,
    Impossible = 0
};

const ai = new AI();

export default class TicTacToe {
    private _game = new Game();

    private _res: InteractionResponse;
    
    private _p1: User;
    private _p2: User;
    private _difficulty?: Difficulty;
    private _ai?: boolean;

    constructor(p1: User, p2: User, { ai, difficulty }: { ai?: boolean, difficulty?: Difficulty } = {}) {
        this._p1 = p1;
        this._p2 = p2;
        this._difficulty = difficulty;
        this._ai = ai;
    };

    private _render() {
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

    private _currentPlayer() {
        return this._game.currentPlayer === Player.First ? this._p1 : this._p2
    };

    private _messageStatus() {
        const p = this._currentPlayer();
        let msg = `\`${this._p1.username}\` VS \`${this._p2.username}\`\n\n`;

        return msg += this._game.winner !== Player.None
        ? i18n.__mf("command_tictactoe.matchWon", { user: p.username })
        : this._game.isBoardFull
            ? i18n.__("command_tictactoe.matchTie")
            : i18n.__mf("command_tictactoe.chooseMove", { user: p.id });
    };

    private async _aiMove(i: any) {
        if(!this._ai || this._game.currentPlayer !== Player.Second) return;

        await sleep(500);

        const board = this._game.convertBoard();
        const move = Math.random() > this._difficulty! ? ai.minimax(this._game, board, this._game.p2sign).index! : ai.emptySpots(board, true);
        this._game.updateGame(move);

        await i.editReply({ content: this._messageStatus(), components: this._render() });
    };
    private async _userMove(i: any) {
        if(i.user.id !== this._currentPlayer().id) return i.followUp({ content: i18n.__("command_tictactoe.waitForTurn"), ephemeral: true });

        this._game.updateGame(i.customId);

        await i.editReply({ content: this._messageStatus(), components: this._render() });
    };

    async start(interaction: CommandInteraction) {
        this._res = await interaction.reply({ content: this._messageStatus(), components: this._render() }) as InteractionResponse;

        this._aiMove(interaction);
        
        const filter = async (i: any) => {
            await i.deferUpdate();
            return [this._p1.id, this._p2.id].includes(i.user.id);
        };
        const collector = this._res.createMessageComponentCollector({ filter });

        collector.on('collect', async (i: any) => {
            this._userMove(i);
            this._aiMove(i);
        });
    };
};