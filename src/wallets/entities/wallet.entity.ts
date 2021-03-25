import { Document } from 'mongoose';
import { ProductEntityDocument } from 'src/products/entities/product.entity';
import { User } from '../../users/interfaces/user.interface'

export interface WalletEntityDocument extends Document {
    readonly user: User;
    readonly toUser: User;
    readonly product: ProductEntityDocument;
    readonly quantity: number;
    readonly price: number;
    readonly total: number;
    readonly resource: string; // user | system
    readonly createdAt: Date;
}