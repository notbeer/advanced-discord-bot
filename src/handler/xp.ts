import { Message, TextChannel } from 'discord.js';
import userRankSchema from '../model/userRank';
import i18n from "../utils/i18n";

// Cache to track cooldowns for each user (userId -> lastXPTime)
const userCooldowns = new Map();

// Set cooldown time in milliseconds (e.g., 30 seconds = 30000ms)
const COOLDOWN_TIME = 30000;

export async function xp(msg: Message) {
    const user = msg.author;
    const guildId = msg.guildId;

    if(user.bot || !msg.guild) return;

    const now = Date.now();

    // Check if user is on cooldown
    const lastXPTime = userCooldowns.get(user.id);
    if (lastXPTime && now - lastXPTime < COOLDOWN_TIME) return;

    // Update the lastXPTime for this user
    userCooldowns.set(user.id, now);

    let guildRank = await userRankSchema.findOne({ guildId });
    if (!guildRank) guildRank = new userRankSchema({ guildId, ranks: [] });

    // Find user inside the ranks array
    let userRank = guildRank.ranks.find(rank => rank.userId === user.id);
    if(!userRank) {
        userRank = { userId: user.id, xp: 0, level: 1 };
        guildRank.ranks.push(userRank);
    };

    const xpGain = Math.floor(Math.random() * 10) + 5;
    userRank.xp += xpGain;

    const nextLevelXp = Math.floor(100 * Math.pow(1.1, userRank.level) * Math.log(userRank.level + 1));
    if(userRank.xp >= nextLevelXp) {
        userRank.level++;
        userRank.xp = 0;

        const channel = msg.channel;
        if(channel instanceof TextChannel) channel.send(i18n.__mf("rank.userLevelUp", { user: user.id, level: userRank.level }));
    };

    await guildRank.save();
};