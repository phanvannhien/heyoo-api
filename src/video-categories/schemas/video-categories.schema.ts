import * as mongoose from 'mongoose';

export const VideoCategoriesSchema = new mongoose.Schema({
    categoryName: String
},{
    collection: 'video-categories'
});