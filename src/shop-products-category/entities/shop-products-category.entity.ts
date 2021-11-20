import { Document } from 'mongoose';

export interface ShopProductCategoryEntityDocument extends Document {
    readonly categoryName: String
}
