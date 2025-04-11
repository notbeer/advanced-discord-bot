import { Guild } from "discord.js";

import ClientExtention from "../client";

import guildSettingSchema from '../model/guildSetting';

import i18n from "../utils/i18n";

export async function language(client: ClientExtention, guild: Guild): Promise<void> {
    const guildId = guild.id;
        
    let language = client.language.get(guildId);
    if(!language) {
        const guildSettings = await guildSettingSchema.findOne({ guildId });
        language = guildSettings?.language;
            
        if(language) {
            i18n.setLocale(language);
            client.language.set(guildId, language);
        };
    } else i18n.setLocale(language);
};