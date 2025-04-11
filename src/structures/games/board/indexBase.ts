import {
    ActionRowBuilder,
    ButtonBuilder,
    CommandInteraction,
    InteractionResponse,
    User
} from "discord.js";

import i18n from "../../../utils/i18n";

import { GameBase, Player } from "../board/gameBase";
import inviteUser from "../inviteUser";

export abstract class MainBase<T extends GameBase> {
    protected _game: T;
    protected _p1: User;
    protected _p2: User;
    protected _aiInstance?: any;

    constructor(p1: User, p2: User, gameInstance: T, aiInstance: any) {
        this._p1 = p1;
        this._p2 = p2;
        this._game = gameInstance;
        this._aiInstance = aiInstance;
    };

    protected abstract _renderButtons(): Array<ActionRowBuilder<ButtonBuilder>>;

    protected _currentPlayer() {
        return this._game.currentPlayer === Player.First ? this._p1 : this._p2;
    };

    protected _extraMessageStatus(): string {
        return "";
    };
    
    protected _messageStatus() {
        const p = this._currentPlayer();
        let msg = `\`${this._p1.username}\` **VS** \`${this._p2.username}\`\n\n`;
    
        msg += this._game.winner !== Player.None
        ? i18n.__mf("game.matchWon", { user: p.username })
        : this._game.isBoardFull
            ? i18n.__("game.matchTie")
            : i18n.__mf("game.chooseMove", { user: p.id, sign: this._game.playerSign(this._game.currentPlayer) });
            
        return msg + this._extraMessageStatus();
    };

    protected async _aiMove(i: any) {
        if(!this._aiInstance || this._game.currentPlayer !== Player.Second) return;

        this._game.updateBoard(this._aiInstance.getMove(this._game.board));

        await i.editReply({ content: this._messageStatus(), components: this._renderButtons() });
    };
    protected async _userMove(i: any): Promise<void> {
        if(i.user.id !== this._currentPlayer().id) return i.followUp({ content: i18n.__("game.waitForTurn"), flags: ['Ephemeral'] });

        this._game.updateBoard(Number(i.customId));

        await i.editReply({ content: this._messageStatus(), components: this._renderButtons() });
    };

    public async start(interaction: CommandInteraction) {
        let res: InteractionResponse<boolean> | false;
        if(this._aiInstance) res = await interaction.reply({ content: this._messageStatus(), components: this._renderButtons() });
        else {
            res = await inviteUser(this._game.name, interaction, this._p2);

            if(!res) return;

            interaction.editReply({ content: this._messageStatus(), embeds: [], components: this._renderButtons() });
        };

        await this._aiMove(interaction);

        const collector = res.createMessageComponentCollector({
            filter: async (i) => {
                await i.deferUpdate().catch();
                return [this._p1.id, this._p2.id].includes(i.user.id);
            }}
        );
        collector.on('collect', async (i) => {
            await this._userMove(i);
            await this._aiMove(i);
        });
    };
};

export { Player };