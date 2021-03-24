import { Document } from 'mongoose';
import { ProductEntityDocument } from 'src/products/entities/product.entity';
import { User } from '../../users/interfaces/user.interface'

export interface OrderEntityDocument extends Document{
    readonly user: User;
    readonly product: ProductEntityDocument;
    readonly quantity: Number;
    readonly price: Number;
    readonly total: Number;
    readonly payment_method: String;
    readonly status: String;
    readonly created_at: Date;
}
