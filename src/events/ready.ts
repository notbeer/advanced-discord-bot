import { ActivityType, Client } from "discord.js";
import { Event, BotStatus } from "@types";
import { log } from "../utils/log";

export const event: Event = {
    name: 'ready',
    once: true,
    async execute(client: Client) {
        try {
            const totalChannels = client.channels.cache.size

            const botStatus: BotStatus[] = [
                {
                    statusType: ActivityType.Listening,
                    statusMessage: `${totalChannels} channels`
                }
            ];

            if(!client.user) return;
            client.user.setActivity(botStatus[0].statusMessage, {
                type: botStatus[0].statusType
            });

            log.info(`${client.user?.username} is online!`);
        } catch(error) {
            log.error(`Error in ready event: ${error}`);
        };
    }
};