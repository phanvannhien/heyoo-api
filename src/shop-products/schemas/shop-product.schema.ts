import * as mongoose from 'mongoose';

export const ShopProductSchema = new mongoose.Schema({
    productName: {
        type: String,
        require: true
    },
    price: Number,
    thumbnail: String,
    images: [String],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShopProductCategories'
    },
    description: String,
    isPublished: {
        type: Boolean,
        default: false
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShopModel'
    }, 
},{
    collection: 'shop_products'
})