import {
    SlashCommandBuilder
} from "discord.js";

import { Guild } from "./guild";

import { Command } from "@types";

export const command: Command = {
    cooldown: '1 minute',
    guildOnly: true,
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get information on various items')
        .addSubcommand(subcommand => subcommand
            .setName('guild')
            .setDescription('Get information on this server')
        )
        .addSubcommand(subcommand => subcommand
            .setName('user')
            .setDescription('Get information on an user')
            .addUserOption(option => option
                .setName('user')
                .setDescription('User to fetch information on')
            )
        ),
    async execute(client, interaction) {
        const subcommand = interaction.options.data[0];
        switch (subcommand.name as unknown as string) {
            case 'guild':
                await Guild(interaction);
            break;
            case 'user':
                await interaction.reply({ content: 'Not implemented yet.', ephemeral: true });
            break;
        };
    }
};