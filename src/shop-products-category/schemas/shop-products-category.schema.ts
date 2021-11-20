import * as mongoose from 'mongoose';

export const ShopProductCategorySchema = new mongoose.Schema({
    categoryName: String
},{
    collection: 'shop_product_categories'
});