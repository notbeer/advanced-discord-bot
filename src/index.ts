import dotenv from "dotenv";
import { ShardingManager } from "discord.js";

import { log } from "./utils/log";

dotenv.config();

const manager = new ShardingManager('src/bot.ts', {
    execArgv: ['-r', 'ts-node/register'],
    token: process.env.BOT_TOKEN,
    totalShards: 'auto'
});


manager.on("shardCreate", (shard) => {
    log.info(`[Sharding] Starting #${shard.id + 1}`);

    shard.on('death', () => log.warn(`[Sharding] Closing shard ${shard.id + 1}/${manager.totalShards}`));
    shard.on('disconnect', () => log.warn(`[Sharding] ${shard.id + 1}/${manager.totalShards} has disconnected`));
    shard.on('reconnecting', () => log.info(`[Sharding] ${shard.id + 1}/${manager.totalShards} is reconnecting`));
});

manager.spawn();