import {
    SlashCommandBuilder,
    User
} from "discord.js";

import TicTacToe from "../../../../structures/games/board/tictactoe";
import { Difficulty } from "../../../../structures/games/board/tictactoe/ai";

import i18n from "../../../../utils/i18n";

import { Command } from "@types";

export const command: Command = {
    cooldown: '30 seconds',
    guildOnly: true,
    data: new SlashCommandBuilder()
        .setName('tictactoe')
        .setDescription('Play a classic game of TicTacToe')
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
                    { name: 'Impossible', value: 'i' }
                )
            )
        ),
    execute(client, interaction) {
        const subcommand = interaction.options.data[0];
        if(subcommand.name === 'user') {
            const opponent = subcommand.options![0].user as User;
            
            if(opponent.bot) return interaction.reply({ content: i18n.__("game.opponentIsBot"), flags: ['Ephemeral'] });
            if(opponent.id === interaction.user.id) return interaction.reply({ content: i18n.__("game.opponentIsSelf"), flags: ['Ephemeral'] });

            new TicTacToe(interaction.user, opponent).start(interaction);
        } else {
            let difficulty = Difficulty.Impossible;
            switch(interaction.options.get('difficulty')?.value as string) {
                case 'e':
                    difficulty = Difficulty.Easy;
                break;
                case 'm':
                    difficulty = Difficulty.Medium;
                break;
            };
            new TicTacToe(interaction.user, client.user!, difficulty).start(interaction);
        };
    }
};