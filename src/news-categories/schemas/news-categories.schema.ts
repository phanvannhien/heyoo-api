import * as mongoose from 'mongoose';

export const NewsCategoriesSchema = new mongoose.Schema({
    categoryName: String
},{
    collection: 'news-categories'
});