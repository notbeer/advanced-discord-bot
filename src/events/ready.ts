import { ActivityType, Client } from "discord.js";

import { log } from "../utils/log";

import { Event } from "@types";

export const event: Event = {
    name: 'ready',
    once: true,
    async execute(client: Client) {
        try {
            if(!client.user) return;

            client.user.setActivity('Someone with a lot of code inside...', {
                type: ActivityType.Custom
            });

            log.success(`[Bot] ${client.user?.username} is online!`);
        } catch(error) {
            log.error(`[Bot] Error in ready event: ${error}`);
        };
    }
};