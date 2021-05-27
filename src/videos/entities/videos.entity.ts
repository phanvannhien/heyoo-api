import { Document } from 'mongoose';
import { AdminUser } from 'src/admin-users/entities/admin-user.entity';
import { VideoCategoriesEntityDocument } from 'src/video-categories/entities/video-category.entity';


export interface VideosEntityDocument extends Document {
    readonly title: string;
    readonly image: string;
    readonly category: VideoCategoriesEntityDocument;
    readonly description: string;
    readonly viewCount: number;
    readonly shareCount: number;
    readonly createdBy: AdminUser;
    readonly updatedBy: AdminUser;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}