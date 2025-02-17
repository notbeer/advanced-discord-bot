import {
    ChatInputCommandInteraction,
    ChannelType,
    Collection
} from 'discord.js';

import ClientExtention from '../client';

import MS from "../lib/ms";

import i18n from "../utils/i18n";

import { log } from '../utils/log';

export async function command(client: ClientExtention, interaction: ChatInputCommandInteraction) {
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if(!command || !interaction.guild?.members?.me?.permissions.has(['SendMessages', 'ViewChannel'])) return;

    if(command.disableCommand) return interaction.reply({ content: i18n.__("command_handler.disableCommand"), ephemeral: true });;

    if(command.guildOnly && interaction.channel?.type === ChannelType.DM) return interaction.reply({ content: i18n.__("command_handler.guildOnly"), ephemeral: true });
    if(command.dmOnly && interaction.channel?.type !== ChannelType.DM) return interaction.reply({ content: i18n.__("command_handler.dmOnly"), ephemeral: true });

    if(command.botPermissions?.length && !interaction.guild?.members?.me?.permissions.has(command.botPermissions)) return interaction.reply({ content: i18n.__mf("command_handler.needPermissions", { permission: command.botPermissions.join(', ') }), ephemeral: true });

    if(!client.cooldowns.has(command.data.name)) client.cooldowns.set(command.data.name, new Collection());
    const now = Date.now();
    const timestamps: Collection<string, number> = client.cooldowns.get(command.data.name) as Collection<string, number>;
    const cooldownAmount = MS(command.cooldown || '0');

    if(timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) as number + cooldownAmount;
        if(now < expirationTime) {
            const timeLeft = (expirationTime - now);
            return interaction.reply({ content: i18n.__mf("command_handler.cooldown", { timeLeft: MS(timeLeft, { fullDuration: true, avoidDuration: ['ms'] }), commandName: command.data.name }), ephemeral: true });
        };
    };
    
    try {
        await command.execute(client, interaction);
    } catch(err) {
        log.error(err);
        interaction.reply({ content: i18n.__("command_handler.unexpectedError"), ephemeral: true });
    } finally {
        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
    };
};