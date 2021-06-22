import { Document } from 'mongoose';
import { User } from 'src/users/interfaces/user.interface';
import { ShopEntityDocument } from './shop.entity';

export interface ShopFollowEntityDocument extends Document {
    readonly shop: ShopEntityDocument;
    readonly user: User;
}
