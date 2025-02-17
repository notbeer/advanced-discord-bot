import { ActivityType, Client } from "discord.js";
import { Event, BotStatus } from "@types";
import { log } from "../utils/log";

export const event: Event = {
    name: 'ready',
    once: true,
    async execute(client: Client) {
        try {
            const totalChannels = client.shard
                ? (await client.shard.fetchClientValues('channels.cache.size') as number[]).reduce((acc, count) => acc + count, 0)
                : client.channels.cache.size;

            const botStatus: BotStatus[] = [
                {
                    statusType: ActivityType.Streaming,
                    URL: "https://www.twitch.tv/notbeer",
                    statusMessage: `@${client.user?.username} me!`
                },
                {
                    statusType: ActivityType.Listening,
                    statusMessage: `${totalChannels} channels`
                }
            ];

            let onIndex = 0;

            function updateStatus() {
                if (!client.user) return;

                const { statusType, statusMessage, URL } = botStatus[0];

                client.user.setActivity(statusMessage, {
                    type: statusType,
                    url: URL
                });

                onIndex = (onIndex + 1) % botStatus.length;
            };

            updateStatus();
            setInterval(updateStatus, 15_000);

            log.info(`${client.user?.username} is online!`);
        } catch(error) {
            log.error(`Error in ready event: ${error}`);
        };
    }
};