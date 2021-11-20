import { Document, Model } from 'mongoose';


export interface ShopProductEntityDocument extends Document {
    readonly thumbnail: string;
    readonly images: string[];
    readonly productName: string;
    readonly price: number;
    readonly category: string;
    readonly description: string;
    readonly shop: string;
    readonly isPublished: boolean;
}