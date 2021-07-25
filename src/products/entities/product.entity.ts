import { Document } from 'mongoose';

export interface ProductEntityDocument extends Document {
    readonly productName: string;
    readonly image: string;
    readonly imageAnimation: string;
    readonly price: number;
}