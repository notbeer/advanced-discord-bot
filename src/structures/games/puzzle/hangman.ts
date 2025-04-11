import {
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    CommandInteraction,
} from "discord.js";

import { buttonPagination } from "../../pagination";

import { words } from "../../../constants/hangman";

import i18n from "../../../utils/i18n";

export default class Hangman {
    protected _page = 0;

    protected _win: boolean;
    protected _wrongs = 0;
    protected _word = words[Math.floor(Math.random() * words.length)].toUpperCase();
    protected _guessed: Array<string> = [];

    protected _i: CommandInteraction;
    constructor(interacion: CommandInteraction) {
        this._i = interacion;
    };

    protected _drawBoard() {
        const parts = [
            "   +-----+",
            "   |     |",
            `   |    ${this._wrongs > 0 ? "🎩" : " "}`,
            `   |    ${this._wrongs > 1 ? "😟" : " "}`,
            `   |    ${this._wrongs > 2 ? "👕" : " "}`,
            `   |    ${this._wrongs > 3 ? "🩳" : " "}`,
            `   |    ${this._wrongs > 4 ? "👞" : " "}`,
            "   |",
            "___|___"
        ];

        return "```" + parts.join("\n") + "```";
    };

    protected _embed() {
        const board = this._drawBoard();
        const embed = new EmbedBuilder()
            .setColor('#f3f3f3')
            .setTitle('Hangman')
            .setDescription(board)
            .addFields({ name: 'Letters Guessed: ', value: this._word.split('').map(v => this._guessed.includes(v) ? v : '\\_').join(' ') })
            .setTimestamp();
        
        switch(typeof this._win) {
            case 'undefined':
                return embed.addFields({ name: 'How To Play?', value: "Use the buttons to guess your letter" });
            case 'boolean':
                embed.addFields(
                    { name: 'Word: ', value: this._word },
                    { name: 'Wrongs: ', value: `${this._wrongs}` },
                )
                return embed.setDescription(`${i18n.__mf(this._win ? "game.matchWon" : "game.matchLost", { user: this._i.user.username })}\n${board}`);
        };
    };

    protected _pagination() {
        if(typeof this._win !== 'undefined') return [];
        const buttons = Array.from({ length: 26 }, (_, i) => {
            const letter = String.fromCharCode(65 + i);
            return new ButtonBuilder()
                .setDisabled(this._guessed.includes(letter))
                .setCustomId(letter)
                .setLabel(letter)
                .setStyle(ButtonStyle.Primary);
        });
        
        return buttonPagination(buttons, this._page, [
            new ButtonBuilder()
                .setCustomId('stop')
                .setLabel('End Game')
                .setStyle(ButtonStyle.Danger)
        ]);
    };

    public async start() {
        const res = await this._i.reply({ embeds: [this._embed()], components: this._pagination() });

        const collector = res.createMessageComponentCollector({
            filter: async (i) => {
                await i.deferUpdate().catch();
                return this._i.user.id === i.user.id;
            }}
        );
        collector.on('collect', async (i) => {
            switch(i.customId) {
                case 'previous':
                    this._page--;
                    break;
                case 'stop':
                    collector.stop('stop');
                    return await this._i.editReply({ embeds: [this._embed()], components: [] });
                case 'next':
                    this._page++;
                    break;
                default:
                    const letter = i.customId;
                    this._guessed.push(letter);

                    if(!this._word.includes(letter)) {
                        this._wrongs++;
                        if(this._wrongs > 5) {
                            this._win = false;
                        }
                    } else if(!this._word.split('').map(v => this._guessed.includes(v) ? v : '_').includes('_')) {
                        collector.stop('stop');
                        this._win = true;
                    };
            };
            await this._i.editReply({ embeds: [this._embed()], components: this._pagination() });
        });
    };
};