import {
    SlashCommandBuilder,
    User
} from "discord.js";

import TicTacToe, { Difficulty } from "../../../structures/games/tictactoe";

import i18n from "../../../utils/i18n";

import { Command } from "@types";

export const command: Command = {
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
            if(opponent.bot) return interaction.reply({ content: i18n.__("command_tictactoe.opponentIsBot"), ephemeral: true });
            if(opponent.id === interaction.user.id) return interaction.reply({ content: i18n.__("command_tictactoe.opponentIsSelf"), ephemeral: true });
            new TicTacToe(interaction.user, opponent).start(interaction);
        } else {
            let difficulty: Difficulty;
            switch(interaction.options.get('difficulty')?.value as string) {
                case 'e':
                    difficulty = Difficulty.Easy;
                break;
                case 'm':
                    difficulty = Difficulty.Medium;
                break;
                case 'i':
                    difficulty = Difficulty.Impossible;
                break;
            };
            new TicTacToe(interaction.user, client.user!, { ai: true, difficulty: difficulty! }).start(interaction);
        };
    }
};