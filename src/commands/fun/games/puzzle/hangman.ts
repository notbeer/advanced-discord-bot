import {
    SlashCommandBuilder,
    User
} from "discord.js";

import { Command } from "@types";
import Hangman from "../../../../structures/games/puzzle/hangman";

export const command: Command = {
    cooldown: '5 second',
    data: new SlashCommandBuilder()
        .setName('hangman')
        .setDescription('Play a fun game of hangman'),
    async execute(_, interaction) {
        new Hangman(interaction).start();
    }
};