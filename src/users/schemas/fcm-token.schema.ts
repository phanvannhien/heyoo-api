import * as mongoose from 'mongoose';

export const FcmTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    fcmToken: String
},{
    collection: 'user_fcmtokens'
});