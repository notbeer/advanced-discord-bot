import dotenv from 'dotenv';
import {
    GatewayIntentBits,
    Partials
} from 'discord.js';

import Client from './client';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent
    ], 
    partials: [Partials.Channel],
    failIfNotExists: false
});

client.init(process.env.BOT_TOKEN!);

//process.on('unhandledRejection')