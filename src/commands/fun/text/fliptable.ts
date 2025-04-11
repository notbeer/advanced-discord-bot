import { SlashCommandBuilder } from "discord.js";

import { Command } from "@types";

const frames = ['(-°□°)-  ┬─┬', '(╯°□°)╯    ]', '(╯°□°)╯  ︵  ┻━┻', '(╯°□°)╯       [', '(╯°□°)╯           ┬─┬'];

export const command: Command = {
    cooldown: '5 second',
    data: new SlashCommandBuilder()
        .setName('fliptable')
        .setDescription('Flip the table...'),
    async execute(_, interaction) {
        const msg = await interaction.reply({ content: '(\\\\°□°)\\\\  ┬─┬' });

        for(const frame of frames) {
            var count = 1;
            setTimeout(async () => {
                if(count > 4) return;

                await msg.edit(frame);
                count++;
            }, 500);
        };
    }
};