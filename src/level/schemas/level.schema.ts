import * as mongoose from 'mongoose';

export const LevelSchema = new mongoose.Schema({
    levelName: String,
    levelImage: String,
    minTarget: Number
});