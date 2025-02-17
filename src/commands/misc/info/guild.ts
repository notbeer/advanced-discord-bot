import {
    ChannelType,
    CommandInteraction,
    EmbedBuilder,
    PresenceUpdateStatus
} from "discord.js";
import moment from "moment";

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

function trimArray(arr: Array<string>, maxLen = 10) {
    if (arr.length > maxLen) {
        const len = arr.length - maxLen;
        arr = arr.slice(0, maxLen);
        arr.push(`${len} more...`);
    };
    return arr;
};

export async function Guild(interaction: CommandInteraction) {
    const guild = interaction.guild!;

    const users = guild.members.cache.filter(m => !m.user.bot).size,
          bots = guild.members.cache.filter(m => m.user.bot).size;

    const offline = guild.members.cache.filter(m => m.presence?.status === PresenceUpdateStatus.Offline).size,
          online = guild.members.cache.filter(m => m.presence?.status === PresenceUpdateStatus.Online).size,
          idle = guild.members.cache.filter(m => m.presence?.status === PresenceUpdateStatus.Idle).size,
          dnd = guild.members.cache.filter(m => m.presence?.status === PresenceUpdateStatus.DoNotDisturb).size;

    const category = guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).size,
          text = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size,
          vc = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size;


    const roles = guild.roles.cache
        .sort((a, b) => b.position - a.position)
        .map(role => role.toString())
        .slice(0, -1);

    const emojis = guild.emojis.cache;

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

            { name: '**Regular emojis: **', value: `${emojis.filter(emoji => !emoji.animated).size}`, inline: true },
            { name: '**Animated emojis: **', value: `${emojis.filter(emoji => emoji.animated).size}`, inline: true },

            { name: `**Roles: ** [${roles.length}]`, value: roles.length < 15 ? roles.join(', ') : roles.length > 15 ? trimArray(roles).join(', ') : 'None', inline: true },
        )
        .setTimestamp();
    interaction.reply({ embeds: [embed] })
};