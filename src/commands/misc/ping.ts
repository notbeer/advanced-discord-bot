import {
    SlashCommandBuilder,
    EmbedBuilder
} from "discord.js";

import { Command } from "@types";

export const command: Command = {
    cooldown: '5 second',
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Fetch clients latency'),
    async execute(client, interaction) {
        await interaction.reply({ content: 'Ping...' });
        const embed = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: client.user?.username!, iconURL: client.user?.displayAvatarURL({ forceStatic: false }) })
            .setTitle('Pong!')
            .addFields(
                { name: '**Message Latency: **', value: `${Math.abs(Date.now() - interaction.createdTimestamp)}ms` },
                { name: '**API Latency: **', value: `${Math.round(client.ws.ping)}ms` }
            )
            .setTimestamp();
        interaction.editReply({ content: null, embeds: [embed] });
    }
};