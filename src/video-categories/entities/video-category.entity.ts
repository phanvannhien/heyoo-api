import { Document } from 'mongoose';

export interface VideoCategoriesEntityDocument extends Document {
    readonly categoryName: String
}
