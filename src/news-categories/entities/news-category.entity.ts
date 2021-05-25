import { Document } from 'mongoose';

export interface NewsCategoriesEntityDocument extends Document {
    readonly categoryName: String
}
