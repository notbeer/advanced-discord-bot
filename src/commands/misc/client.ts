import {
    SlashCommandBuilder,
    EmbedBuilder,
    version as djsversion
} from "discord.js";
import { utc } from "moment";

import AdvancedMS from "advanced-ms";

import packageInfo from '../../../package.json';

import { toBytes } from "../../utils/formatter";

import { Command } from "@types";

export const command: Command = {
    cooldown: '1 minute',
    data: new SlashCommandBuilder()
        .setName('client')
        .setDescription('Get information on the client'),
    async execute(client, interaction) {
        const cli = client.user!,
              uptime = client.uptime as number,
              guildCount = client.guilds.cache.size,
              channelCount = client.channels.cache.size,
              userCount = client.users.cache.size;

        const avatarEmbed = new EmbedBuilder()
            .setColor("#2F3136")
            .setAuthor({ name: cli.username, iconURL: cli.displayAvatarURL({ forceStatic: false }) })
            .setThumbnail(cli.displayAvatarURL({ forceStatic: false }))
            .addFields(
                { name: '**Uptime: **', value: AdvancedMS(uptime, { compactDuration: true, avoidUnits: ['ms'] }), inline: true },
                { name: '**Client: **', value: cli.tag, inline: true },
                { name: '**Client ID: **', value: cli.id, inline: true },
                { name: '**Creation Date: **', value: utc(cli.createdTimestamp).format('LLLL'), inline: true },
                { name: '**Guilds: **', value: `${guildCount}`, inline: true },
                { name: '**Channels: **', value: `${channelCount}`, inline: true },
                { name: '**Users: **', value: `${userCount}`, inline: true },
                { name: '**Discord.js Version: **', value: djsversion, inline: true },
                { name: '**Node.js Version: **', value: process.version, inline: true },
                { name: '**Version: **', value: packageInfo.version, inline: true },
                { name: '**Ram Usage: **', value: toBytes(process.memoryUsage().rss), inline: true },
                { name: '**Heap Used: **', value: toBytes(process.memoryUsage().heapUsed), inline: true },
                { name: '**Heap Total: **', value: toBytes(process.memoryUsage().heapTotal), inline: true },
                { name: '**External Usage: **', value: toBytes(process.memoryUsage().external), inline: true },
                { name: '**Bot Created By: **', value: packageInfo.author, inline: true }
            )
            .setTimestamp();
        interaction.reply({ embeds: [avatarEmbed] });
    }
};