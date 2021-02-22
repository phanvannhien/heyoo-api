import { Document } from 'mongoose';

export interface CategoriesEntityDocument extends Document {
    readonly categoryName: String
}
