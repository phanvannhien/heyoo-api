import * as mongoose from 'mongoose';

export const PackageSchema = new mongoose.Schema({
    name: String,
    price: Number,
    quantity: Number,
    image: String,
    isBestSale: {
        type: Boolean,
        default: false
    },
},{
    collection: 'packages'
})