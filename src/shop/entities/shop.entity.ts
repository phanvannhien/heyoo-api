import { Document } from 'mongoose';
import { ShopCategoriesEntityDocument } from 'src/shop-categories/entities/shop-category.entity';
import { User } from '../../users/interfaces/user.interface'

export interface ShopEntityDocument extends Document {
    readonly shopName: string;
    readonly image: string;
    readonly banner: string;
    readonly phone: string;
    readonly email: string;
    readonly location: String;
    readonly description: String;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly viewCount: number;
    readonly status: number;
    readonly category: ShopCategoriesEntityDocument;
    readonly user: User;
}