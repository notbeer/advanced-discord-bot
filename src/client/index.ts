import path from 'path';
import mongoose from 'mongoose';
import {
    Client,
    Collection
} from "discord.js";

import { crawlDir } from '../utils/crawler';
import { log } from '../utils/log';

import { Event, Command } from "@types";

class ClientExtention extends Client {
    public cooldowns: Collection<string, Collection<string, number>> = new Collection();
    public commands: Collection<string, Command> = new Collection();

    public async init(token: string): Promise<void> {
        await this._deployEvents();
        await this._deployCommands();
        await this._connectToMongoose();
        this.login(token);
    };
    private async _connectToMongoose(): Promise<void> {
        await mongoose.connect(process.env.MONGO_URI!)
            .then(() => log.info('Connected to MongoDB.'))
            .catch(err => log.error(`MongoDB connection error: ${err}`));
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