import dotenv from 'dotenv';
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

import { log } from "../src/utils/log";
import { checkEnvVariables } from "../src/utils/env";

dotenv.config();

checkEnvVariables(['BOT_TOKEN', 'BOT_ID']);

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN!);

rest.put(
    process.env.DEVELOPMENT_GUILD_ID ? 
    Routes.applicationGuildCommands(process.env.BOT_ID!, process.env.DEVELOPMENT_GUILD_ID!) :
    Routes.applicationCommands(process.env.BOT_ID!),
    {
        body: []
    }
).then(() => log.success(`[Slash Command] Successfully deleted all commands ${process.env.DEVELOPMENT_GUILD_ID ? 'in DEVELOPMENT GUILD' : 'GLOBALLY'}!`));