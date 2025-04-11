import {
    ActivityType,
    GuildMember,
    EmbedBuilder,
    Emoji,
    Activity
} from "discord.js";

import AdvancedMS from "advanced-ms";

// const activity = (activity: Activity, timeStart: string, timeEnd: string) => {
//     switch(activity.type) {
//         case 0:
//             return `Playing **${activity.name}** for ${timeStart}`;
//         case 1:
//             return `Streaming on **${activity.name}**${time}`;
//         case 2:
//             return `Listening on **${activity.name}**${time} **${activity.details} by ${activity.state}**`;
//         case 3:
//             return `Watching on **${activity.name}**${time}`;
//         case 4:
//             return `${activity.state}`;
//         //Activity 5
//         default: '';
//     }
// };
// const activity = {
//     0: 'Playing',
//     1: 'Streaming',
//     2: 'Listening',
//     3: 'Watching',
//     4: 'Custom',
//     5: 'Competing'
// };

const status = {
    online: "https://emoji.gg/assets/emoji/9166_online.png",
    idle: "https://emoji.gg/assets/emoji/3929_idle.png",
    dnd: "https://emoji.gg/assets/emoji/2531_dnd.png",
    offline: "https://emoji.gg/assets/emoji/7445_status_offline.png",
    invisible: 'https://emoji.gg/assets/emoji/7445_status_offline.png'
};

export async function UserEmbed(member: GuildMember) {
    const flags = member.flags?.toArray();
    
    const embed = new EmbedBuilder()
        .setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL({ forceStatic: true }) })
        .setThumbnail(member.displayAvatarURL({ forceStatic: true }))
        .setFooter({ text: member.presence?.status || 'offline', iconURL: status[member.presence?.status || 'offline'] });
    
    // if(member.presence && member.presence.activities.length) {
    //     const array = [];
    //     const datas = member.presence.activities;

    //     console.log(datas)
    //     for(const data of datas) {
    //         const timeStart =  data.timestamps?.start ? AdvancedMS(Date.now() - data.timestamps?.start?.getTime(), { avoidUnits: ['ms'], compactDuration: true }) : null;
    //         const timeEnd = 
    //         const type = activity(data, timeStart);
            

    //         // if(data.name === "Spotify" && data.type === 2) {
    //         //     array.push(`**Listening on Spotify [${AdvancedMS(Date.now() - (data.timestamps?.start?.getTime() || 0), { avoidUnits: ['ms'], compactDuration: true } )} / ${AdvancedMS((data.timestamps?.end?.getTime() || 0) - (data.timestamps?.start?.getTime() || 0), { avoidUnits: ['ms'], compactDuration: true })}]: **\n\`${data.details} by ${data.state}\``)
    //         //     embed.setThumbnail(`https://i.scdn.co/image/${data.assets?.largeImage?.replace("spotify:", "")}`);
    //         // } else array.push(`**${type}**: \`${name}\``);
    //     };

    //     // embed.setDescription(array.join("\n"));
    // };

    return embed;
};