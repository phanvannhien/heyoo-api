import { Document } from 'mongoose';
import { AdminUser } from 'src/admin-users/entities/admin-user.entity';
import { NewsCategoriesEntityDocument } from 'src/news-categories/entities/news-category.entity';


export interface NewsEntityDocument extends Document {
    readonly title: string;
    readonly image: string;
    readonly category: NewsCategoriesEntityDocument;
    readonly description: string;
    readonly viewCount: number;
    readonly shareCount: number;
    readonly createdBy: AdminUser;
    readonly updatedBy: AdminUser;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly status: number;
}