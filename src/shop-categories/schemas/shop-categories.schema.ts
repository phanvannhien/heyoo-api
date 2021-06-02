import * as mongoose from 'mongoose';

export const ShopCategoriesSchema = new mongoose.Schema({
    categoryName: String
},{
    collection: 'shop-categories'
});