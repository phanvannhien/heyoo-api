import { Document } from 'mongoose';
import { User } from '../../users/interfaces/user.interface'

export interface TransactionEntityDocument extends Document {
    readonly user: User;
    readonly referenceId: string;
    readonly transactionId: string;
    readonly quantity: number;
    readonly rate: number;
    readonly total: number;
    readonly status: string;
    readonly paymentMethod: string;
    readonly resource: string;
    readonly createdAt: Date;
}