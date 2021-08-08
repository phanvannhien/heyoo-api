import * as mongoose from 'mongoose';
import * as mongoose_delete from 'mongoose-delete';

export const ProductSchema = new mongoose.Schema({
    productName: String,
    price: Number,
    image: String,
    imageAnimation: String,
})

// .plugin(mongoose_delete, {
//     deletedAt : true,
//     deletedBy: true,
//     overrideMethods: true
// });