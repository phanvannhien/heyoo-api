import * as mongoose from 'mongoose';

export const CategoriesSchema = new mongoose.Schema({
    categoryName: String
});