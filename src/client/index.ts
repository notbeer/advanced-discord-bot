import path from 'path';
import mongoose from 'mongoose';
import {
    Client,
    Collection
} from "discord.js";

import { log } from '../utils/log';
import { crawlDir } from '../utils/crawler';

import { Event, Command } from "@types";

class ClientExtention extends Client {
    public cooldowns: Collection<string, Collection<string, number>> = new Collection();
    public commands: Collection<string, Command> = new Collection();
    public language: Collection<string, string> = new Collection();

    public async init(token: string): Promise<void> {
        log.info('[Bot] Connecting to all modules...')
        await this._deployEvents();
        await this._deployCommands();
        await this._connectToMongoose();
        await this.login(token);
    };
    private async _connectToMongoose(): Promise<void> {
        try {
            await mongoose.connect(process.env.MONGO_URI!);
            log.success('[MongoDB] Connected to the database.');
        } catch (err) {
            log.error(`[MongoDB] Failed to connect to the database: ${err}`);
            process.exit(1);
        };
    };
    private async _deployEvents(): Promise<void> {
        for(const file of crawlDir(path.join(__dirname, "..", 'events'), 'ts')) {
            const { event }: { event: Event } = await import(file);
            if(event && 'execute' in event) {
                event.once
                ? this.once(event.name, (...args) => event.execute(this, ...args))
                : this.on(event.name, (...args) => event.execute(this, ...args));
                log.success(`[Event] Loaded: ${event.name}`);
            };
        };
    };
    private async _deployCommands(): Promise<void> {
        for(const file of crawlDir(path.join(__dirname, "..", 'commands'), 'ts')) {
            const { command }: { command: Command } = await import(file);
            if(command?.data && 'execute' in command) {
                this.commands.set(command.data.name, command);
                log.success(`[Slash Command] Loaded: ${command.data.name}`);
            };
        };
    };
};

export default ClientExtention;