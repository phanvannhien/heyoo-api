import * as mongoose from 'mongoose';

export const UserWallCommentSchema = new mongoose.Schema({
    comment: { type: String, require: true },
    wall: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserWallsModel'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true,
    collection: 'user_wall_comments'
});