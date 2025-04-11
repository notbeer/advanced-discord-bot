import dotenv from "dotenv";
import {
    ChatInputCommandInteraction,
    ChannelType,
    Collection
} from 'discord.js';

import AdvancedMS from "advanced-ms";

import ClientExtention from '../client';

import { language } from "./language";

import i18n from "../utils/i18n";
import { log } from '../utils/log';

dotenv.config();

export async function command(client: ClientExtention, interaction: ChatInputCommandInteraction) {
    const command = client.commands.get(interaction.commandName);
    if(!command || !interaction.guild?.members?.me?.permissions.has(['SendMessages', 'ViewChannel'])) return;
   
    // Remove PROJECT variable to have the language updated
    if(interaction.channel?.type === ChannelType.GuildText) await language(client, interaction.guild);

    if(command.disableCommand) return interaction.reply({ content: i18n.__("command_handler.disableCommand"), flags: ['Ephemeral'] });

    if(command.guildOnly && interaction.channel?.type === ChannelType.DM) return interaction.reply({ content: i18n.__("command_handler.guildOnly"), flags: ['Ephemeral'] });
    if(command.dmOnly && interaction.channel?.type !== ChannelType.DM) return interaction.reply({ content: i18n.__("command_handler.dmOnly"), flags: ['Ephemeral'] });

    if(command.botPermissions?.length && !interaction.guild?.members?.me?.permissions.has(command.botPermissions)) return interaction.reply({ content: i18n.__mf("command_handler.needPermissions", { permission: command.botPermissions.join(', ') }), flags: ['Ephemeral'] });

    if(!client.cooldowns.has(command.data.name)) client.cooldowns.set(command.data.name, new Collection());
    const now = Date.now();
    const timestamps: Collection<string, number> = client.cooldowns.get(command.data.name) as Collection<string, number>;
    const cooldownAmount = AdvancedMS(command.cooldown || '0');

    if(timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) as number + cooldownAmount;
        if(now < expirationTime) {
            const timeLeft = expirationTime - now;
            return interaction.reply({ content: i18n.__mf("command_handler.cooldown", { timeLeft: AdvancedMS(timeLeft, { avoidUnits: ['ms'] }), commandName: command.data.name }), flags: ['Ephemeral'] });
        };
    };
    
    try {
        await command.execute(client, interaction);
    } catch(err) {
        log.error(err, false);
        interaction.reply({ content: i18n.__("command_handler.unexpectedError"), flags: ['Ephemeral'] });
    } finally {
        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
    };
};