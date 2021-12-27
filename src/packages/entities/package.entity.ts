import { Document, Model } from 'mongoose';

export interface PackageEntityDocument extends Document {
    readonly name: string;
    readonly image: string;
    readonly quantity: number;
    readonly price: number;
    readonly isBestSale: number;
}