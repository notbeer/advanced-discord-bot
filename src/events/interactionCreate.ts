import { ChatInputCommandInteraction } from 'discord.js';

import { command } from '../../src/handler/command';

import { Event } from "@types";

export const event: Event = {
    name: 'interactionCreate',
    async execute(client, interaction: ChatInputCommandInteraction) {
        if(interaction.isCommand()) command(client, interaction);
    }
};