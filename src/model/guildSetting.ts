import mongoose, {
    Document
} from 'mongoose';

export interface GuildSettingDocument extends Document {
    guildId: string,
    language: string
}

const guildSettingSchema = new mongoose.Schema<GuildSettingDocument>({
    guildId: { type: String, required: true, unique: true },
    language: { type: String }
});

export default mongoose.model<GuildSettingDocument>('GuildSetting', guildSettingSchema);