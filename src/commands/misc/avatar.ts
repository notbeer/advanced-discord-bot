import {
    SlashCommandBuilder,
    EmbedBuilder,
    User
} from "discord.js";

import i18n from "../../utils/i18n";

import { Command } from "@types";

export const command: Command = {
    cooldown: '10 seconds',
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get users avatar')
        .addUserOption(option => option
            .setName('target')
            .setDescription('Get targets avatar')
        ),
    execute(client, interaction) {
        const target = (interaction.options.getUser('target')) as User || interaction.user, avatar = target.avatarURL();
        if(typeof avatar !== 'string') return interaction.reply({ content: i18n.__("command_avatar.defaultAvatar"), flags: ['Ephemeral'] });

        const avatarEmbed = new EmbedBuilder()
            .setColor("#2F3136")
            .setTitle(i18n.__mf("command_avatar.targetAvatar", { tag: target.tag }))
            .setURL(target.avatarURL() as string)
            .setImage(target.avatarURL({ size: 4096, forceStatic: false }) as string)
            .setTimestamp();
        interaction.reply({ embeds: [avatarEmbed] });
    }
};