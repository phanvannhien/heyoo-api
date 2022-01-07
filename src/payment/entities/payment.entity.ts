import { Document, Model } from 'mongoose';

export interface PaymentEntityDocument extends Document {
    readonly orderInfo: string;
    readonly price: number;
    readonly diamondQty: number;
    readonly status: string;
    readonly user: string;
}