import { Document } from 'mongoose';

export interface ShopCategoriesEntityDocument extends Document {
    readonly categoryName: String
}
