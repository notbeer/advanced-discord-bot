import mongoose, {
    Document
} from 'mongoose';

export interface UserRankDocument extends Document {
    guildId: string,
    ranks: Array<{
        userId: string,
        xp: number,
        level: number
    }>
}

const userRankSchema = new mongoose.Schema<UserRankDocument>({
    guildId: { type: String, required: true, unique: true },
    ranks: [
        {
            userId: { type: String, required: true, unique: true },
            xp: { type: Number, required: true },
            level: { type: Number, required: true }
        }
    ]
});

export default mongoose.model<UserRankDocument>('UsersRank', userRankSchema);