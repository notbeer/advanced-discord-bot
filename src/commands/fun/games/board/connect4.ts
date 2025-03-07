import {
    SlashCommandBuilder,
    User
} from "discord.js";

import Connect4 from "../../../../structures/games/board/connect4";
import { Difficulty } from "../../../../structures/games/board/connect4/ai";

import i18n from "../../../../utils/i18n";

import { Command } from "@types";

export const command: Command = {
    guildOnly: true,
    data: new SlashCommandBuilder()
        .setName('connect4')
        .setDescription('Play a classic game of Connect4')
        .addSubcommand(subcommand => subcommand
            .setName('user')
            .setDescription('Play against an user')
            .addUserOption(option => option
                .setRequired(true)
                .setName('opponent')
                .setDescription('Your opponent')
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('bot')
            .setDescription('Play against an AI')
            .addStringOption(option => option
                .setRequired(true)
                .setName('difficulty')
                .setDescription('Match difficulty level')
                .addChoices(
                    { name: 'Easy', value: 'e' },
                    { name: 'Medium', value: 'm' },
                    { name: 'Hard', value: 'h' }
                )
            )
        ),
    execute(client, interaction) {
        const subcommand = interaction.options.data[0];
        if(subcommand.name === 'user') {
            const opponent = subcommand.options![0].user as User;

            if(opponent.bot) return interaction.reply({ content: i18n.__("game.opponentIsBot"), flags: ['Ephemeral'] });
            if(opponent.id === interaction.user.id) return interaction.reply({ content: i18n.__("game.opponentIsSelf"), flags: ['Ephemeral'] });
            
            new Connect4(interaction.user, opponent).start(interaction);
        } else {
            let difficulty = Difficulty.Hard;
            switch(interaction.options.get('difficulty')?.value as string) {
                case 'e':
                    difficulty = Difficulty.Easy;
                break;
                case 'm':
                    difficulty = Difficulty.Medium;
                break;
            };
            new Connect4(interaction.user, client.user!, difficulty).start(interaction);
        };
    }
};