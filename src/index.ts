import dotenv from 'dotenv';
import {
    GatewayIntentBits,
    Partials
} from 'discord.js';

import Client from './client';

dotenv.config();

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences
    ], 
    partials: [Partials.Channel],
    failIfNotExists: false
});

client.init(process.env.BOT_TOKEN!);