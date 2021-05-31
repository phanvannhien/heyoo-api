import { Document } from 'mongoose';
import { AdminUser } from 'src/admin-users/entities/admin-user.entity';
import { VideoCategoriesEntityDocument } from 'src/video-categories/entities/video-category.entity';


export interface VideosEntityDocument extends Document {
    readonly title: String;
    readonly image: String;
    readonly category: VideoCategoriesEntityDocument;
    readonly description: String;
    readonly excerpt: String;
    readonly videoUrl: String;
    readonly viewCount: number;
    readonly shareCount: number;
    readonly createdBy: AdminUser;
    readonly updatedBy: AdminUser;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly status: Number;
}