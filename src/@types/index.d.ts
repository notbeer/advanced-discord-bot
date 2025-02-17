import {
    CommandInteraction,
    ClientEvents,
    PermissionFlags
} from 'discord.js';

import Client from '../client';

type Permissions = "CreateInstantInvite" | "KickMembers" | "BanMembers" | "Administrator" | "ManageChannels" | "ManageGuild" | "AddReactions" | "ViewAuditLog" | "PrioritySpeaker" | "Stream" | "ViewChannel" | "SendMessages" | "SendTTSMessages" | "ManageMessages" | "EmbedLinks" | "AttachFiles" | "ReadMessageHistory" | "MentionEveryone" | "UseExternalEmojis" | "ViewGuildInsights" | "Connect" | "Speak" | "MuteMembers" | "DeafenMembers" | "MoveMembers" | "UseVAD" | "ChangeNickname" | "ManageNicknames" | "ManageRoles" | "ManageWebhooks" | "ManageEmojisAndStickers" | "UseApplicationCommands" | "RequestToSpeak" | "ManageEvents" | "ManageThreads" | "CreatePublicThreads" | "CreatePrivateThreads" | "UseExternalStickers" | "SendMessagesInThreads" | "UseEmbeddedActivities" | "ModerateMembers";

export interface Command {
    disableCommand?: boolean,
    guildOnly?: boolean,
    dmOnly?: boolean,
    category?: string,
    botPermissions?: Array<Permissions>,
    cooldown?: string,
    data: any,
    execute(client: Client, interaction: CommandInteraction): any
};

export interface Event {
    name: keyof ClientEvents,
    once?: boolean,
    execute(client: Client, ...args: any[]): any
}

export { BotStatus } from './events/ready';
export { CompactUnitAnyCase, DurationInterface } from './lib/ms';