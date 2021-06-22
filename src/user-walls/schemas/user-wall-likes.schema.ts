import * as mongoose from 'mongoose';
import { USER_WALL_MODEL } from 'src/mongo-model.constance';

export const UserWallLikesSchema = new mongoose.Schema({
    userWall: {
        type: mongoose.Schema.Types.ObjectId,
        ref: USER_WALL_MODEL
    },
    userLike: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    collection: 'user_wall_likes'
});