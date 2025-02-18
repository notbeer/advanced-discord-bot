import { Message } from 'discord.js';

import { xp } from '../handler/xp';

import { Event } from "@types";

export const event: Event = {
    name: 'messageCreate',
    async execute(client, message: Message) {
        xp(message);
    }
};