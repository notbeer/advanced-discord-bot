import {
    SlashCommandBuilder
} from "discord.js";

import { Command } from "@types";

const mapping: any = { ' ': '   ', '0': ':zero:', '1': ':one:', '2': ':two:', '3': ':three:', '4': ':four:', '5': ':five:', '6': ':six:', '7': ':seven:', '8': ':eight:', '9': ':nine:', '!': ':grey_exclamation:', '?': ':grey_question:', '#': ':hash:', '*': ':asterisk:'};

'abcdefghijklmnopqrstuvwxyz'.split('').forEach(v => {
    mapping[v] = mapping[v.toUpperCase()] = ` :regional_indicator_${v}:`;
});

export const command: Command = {
    cooldown: '5 seconds',
    data: new SlashCommandBuilder()
        .setName('emojify')
        .setDescription('Replace letters with emojis')
        .addStringOption(option => option
            .setRequired(true)
            .setName('text')
            .setDescription('Text to emojify')
        ),
    async execute(_, interaction) {
        const text = interaction.options.get('text')?.value as string;
        
        interaction.reply({ content: text?.split('').map(v => mapping[v] || v).join('') });
    }
};