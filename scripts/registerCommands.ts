import path from "path";
import dotenv from 'dotenv';
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

import { crawlDir } from "../src/utils/crawler";
import { log } from "../src/utils/log";
import { checkEnvVariables } from "../src/utils/env";

import { Command } from "../src/@types";

dotenv.config();

checkEnvVariables(['BOT_TOKEN', 'BOT_ID']);

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN!);

(async () => {
    const commands: Array<Command> = [];

    try {
        for(const file of crawlDir(path.join(__dirname, '..', 'src/commands'), 'ts')) {
            const { command }: { command: Command } = await import(file);

            if(!command) {
                log.warn(`[Slash Command] Skipping ${file} - No 'command' export found.`);
                continue;
            };
            
            command?.data && 'execute' in command ? commands.push(command.data.toJSON()) : log.warn(`[Slash Command] The command at ${file} is missing a required "data" or "execute" property.`)
        };
        await rest.put(
			process.env.DEVELOPMENT_GUILD_ID ? 
            Routes.applicationGuildCommands(process.env.BOT_ID!, process.env.DEVELOPMENT_GUILD_ID) :
            Routes.applicationCommands(process.env.BOT_ID!),
			{
				body: commands
			}
		);
        log.success(`[Slash Command] Successfully deployed all commands ${process.env.DEVELOPMENT_GUILD_ID ? 'in DEVELOPMENT GUILD' : 'GLOBALLY'}!`);
    } catch(err) {
        log.error(err);
    };
})();