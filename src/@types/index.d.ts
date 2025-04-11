import {
    ChatInputCommandInteraction,
    ClientEvents,
    PermissionFlags
} from 'discord.js';

import Client from '../client';

import { TimeFormat } from './lib/ms';

type Permissions = "CreateInstantInvite" | "KickMembers" | "BanMembers" | "Administrator" | "ManageChannels" | "ManageGuild" | "AddReactions" | "ViewAuditLog" | "PrioritySpeaker" | "Stream" | "ViewChannel" | "SendMessages" | "SendTTSMessages" | "ManageMessages" | "EmbedLinks" | "AttachFiles" | "ReadMessageHistory" | "MentionEveryone" | "UseExternalEmojis" | "ViewGuildInsights" | "Connect" | "Speak" | "MuteMembers" | "DeafenMembers" | "MoveMembers" | "UseVAD" | "ChangeNickname" | "ManageNicknames" | "ManageRoles" | "ManageWebhooks" | "ManageEmojisAndStickers" | "UseApplicationCommands" | "RequestToSpeak" | "ManageEvents" | "ManageThreads" | "CreatePublicThreads" | "CreatePrivateThreads" | "UseExternalStickers" | "SendMessagesInThreads" | "UseEmbeddedActivities" | "ModerateMembers";

type FullUnit = `${BaseFullUnit}s` | BaseFullUnit;

type CompactUnit = 'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'mo' | 'y';
type BaseFullUnit = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
export type TimeFormat =
    | `${number}${CompactUnit}`      // "1m", "2h"
    | `${number} ${CompactUnit}`     // "1 m", "2 h"
    | `${number}${FullUnit}`         // "1second", "2minutes"
    | `${number} ${FullUnit}`;       // "1 second", "2 minutes"

export interface Command {
    disableCommand?: boolean,
    guildOnly?: boolean,
    dmOnly?: boolean,
    botPermissions?: Array<Permissions>,
    cooldown?: TimeFormat,
    data: any,
    execute(client: Client, interaction: ChatInputCommandInteraction): any
};

export interface Event {
    name: keyof ClientEvents,
    once?: boolean,
    execute(client: Client, ...args: any[]): any;
};