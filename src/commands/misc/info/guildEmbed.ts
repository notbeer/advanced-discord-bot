import {
    ChannelType,
    EmbedBuilder,
    Guild,
    PresenceUpdateStatus
} from "discord.js";
import moment from "moment";

import { trimArray } from "../../../utils/formatter";

const verificationLevels = {
    0: 'None',
    1: 'Low',
    2: 'Medium',
    3: 'High (╯°□°）╯︵ ┻━┻',
    4: 'Very High ┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
};
const filterLevels = {
    0: 'Off',
    1: 'No Role',
    2: 'Everyone'
};

export async function GuildEmbed(guild: Guild) {
    const users = guild.members.cache.filter(m => !m.user.bot).size,
          bots = guild.members.cache.filter(m => m.user.bot).size;

    const offline = guild.members.cache.filter(m => m.presence?.status === PresenceUpdateStatus.Offline).size,
          online = guild.members.cache.filter(m => m.presence?.status === PresenceUpdateStatus.Online).size,
          idle = guild.members.cache.filter(m => m.presence?.status === PresenceUpdateStatus.Idle).size,
          dnd = guild.members.cache.filter(m => m.presence?.status === PresenceUpdateStatus.DoNotDisturb).size;
          
    const roles = guild.roles.cache
          .sort((a, b) => b.position - a.position)
          .map(role => role.toString())
          .slice(0, -1);
  
      const emojis = guild.emojis.cache;

    const category = guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).size,
          text = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size,
          vc = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size,
          announcement = guild.channels.cache.filter(c => c.type === ChannelType.GuildAnnouncement).size,
          announcementThread = guild.channels.cache.filter(c => c.type === ChannelType.AnnouncementThread).size,
          publicThread = guild.channels.cache.filter(c => c.type === ChannelType.PublicThread).size,
          privateThread = guild.channels.cache.filter(c => c.type === ChannelType.PrivateThread).size,
          guildStageVoice = guild.channels.cache.filter(c => c.type === ChannelType.GuildStageVoice).size,
          guildForum = guild.channels.cache.filter(c => c.type === ChannelType.GuildForum).size,
          guildMedia = guild.channels.cache.filter(c => c.type === ChannelType.GuildMedia).size;

    const guildIcon = guild.iconURL({ forceStatic: false })!;
    const embed = new EmbedBuilder()
        .setColor("#36393f")
        .setThumbnail(guildIcon)
        .setAuthor({ name: guild.name, iconURL: guildIcon })
        .addFields(
            { name: '**Guild owner: **', value: (await guild.fetchOwner()).user.username, inline: true },
            { name: '**Guild ID: **', value: guild.id, inline: true },
            { name: '**Guild boost tier: **', value: guild.premiumTier ? `Level ${guild.premiumTier}` : 'Level 0', inline: true },
            { name: '**Total boosts: **', value: `${guild.premiumSubscriptionCount || '0'}` },
            { name: '**Guild created: **', value: `${moment(guild.createdAt).format("LLLL")}`, inline: true },

            { name: '**Verification level: **', value: verificationLevels[guild.verificationLevel], inline: true },
            { name: '**Explicit filter: **', value: filterLevels[guild.explicitContentFilter], inline: true },

            { name: '**Users: **', value: `${users}`, inline: true },
            { name: '**Bots: **', value: `${bots}`, inline: true },

            { name: '**Offline: **', value: `${offline}`, inline: true },
            { name: '**Online: **', value: `${online}`, inline: true },
            { name: '**IDLE: **', value: `${idle}`, inline: true },
            { name: '**DND: **', value: `${dnd}`, inline: true },

            { name: '**Channel Category: **', value: `${category}`, inline: true },
            { name: '**Text channels: **', value: `${text}`, inline: true },
            { name: '**Voice channels: **', value: `${vc}`, inline: true },
            { name: '**Announcement channels: **', value: `${announcement}`, inline: true },
            { name: '**Announcement Threads: **', value: `${announcementThread}`, inline: true },
            { name: '**Public Thread: **', value: `${publicThread}`, inline: true },
            //{ name: '**Private Thread: **', value: `${privateThread}`, inline: true },
            { name: '**Guild Stage Voice channels: **', value: `${guildStageVoice}`, inline: true },
            { name: '**Guild Forum: **', value: `${guildForum}`, inline: true },
            { name: '**Guild Media: **', value: `${guildMedia}`, inline: true },

            { name: '**Regular emojis: **', value: `${emojis.filter(emoji => !emoji.animated).size}`, inline: true },
            { name: '**Animated emojis: **', value: `${emojis.filter(emoji => emoji.animated).size}`, inline: true },

            { name: `**Roles: ** [${roles.length}]`, value: roles.length < 15 ? roles.join(', ') : roles.length > 15 ? trimArray(roles).join(', ') : 'None', inline: true },
        )
        .setTimestamp();
    
    return embed;
};