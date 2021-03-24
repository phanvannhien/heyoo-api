import * as mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema({
    productName: String,
    price: Number,
    image: String
});