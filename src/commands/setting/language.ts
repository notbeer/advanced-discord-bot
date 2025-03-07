import {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField
} from "discord.js";

import guildSettingSchema from "../../model/guildSetting";

import { Language } from "../../constants/language";

import { Command } from "@types";

export const command: Command = {
    guildOnly: true,
    cooldown: '5m',
    data: new SlashCommandBuilder()
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setName('language')
        .setDescription('Change the Discord bots language')
        .addStringOption(option => option
            .setRequired(true)
            .setName('language')
            .setDescription('Choose what language to set the bot to')
            .addChoices(Object.entries(Language).map(([key, value]) => ({
                name: key,
                value: value
            })))
        ),
    async execute(client, interaction) {
        const guildId = interaction.guild!.id;

        let guildSetting = await guildSettingSchema.findOne({ guildId });
        if(!guildSetting) guildSetting = new guildSettingSchema({ guildId });

        const language = interaction.options.get('language')?.value as string
        guildSetting.language = language;

        await guildSetting.save();
        client.language.set(guildId, language);

        const embed = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: client.user?.username!, iconURL: client.user?.displayAvatarURL({ forceStatic: false }) })
            .setTitle(`Language set to ${Object.entries(Language).find(([_, val]) => val === language)![0]}`)
            .setTimestamp();

        interaction.reply({ embeds: [embed] });
    }
};