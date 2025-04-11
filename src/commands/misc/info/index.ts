import {
    SlashCommandBuilder
} from "discord.js";

import { GuildEmbed } from "./guildEmbed";

import { Command } from "@types";
import { UserEmbed } from "./userEmbed";

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
    async execute(_, interaction) {
        const subcommand = interaction.options.data[0];
        switch (subcommand.name) {
            case 'guild':
                const guildEmbed = await GuildEmbed(interaction.guild!);
                await interaction.reply({ embeds: [guildEmbed] });
            break;
            case 'user':
                const guildMember = await interaction.guild?.members.fetch(interaction.options.data[0].user || interaction.user);

                if(!guildMember) return;

                const userEmbed = await UserEmbed(guildMember);
                await interaction.reply({ embeds: [userEmbed] });
            break;
        };
    }
};