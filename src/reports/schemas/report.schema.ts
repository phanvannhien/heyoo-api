import * as mongoose from 'mongoose';

export enum ReportSubject {
    USER = 'user',
    POST = 'post',
    NEWS = 'news',
    VIDEOS = 'video',
    LIVESTREAM = 'livestream',
    SHOP = 'shop',
    PRODUCT = 'product'
}



export const ReportSchema = new mongoose.Schema({
    subject: {
        type: String,
        enum: ReportSubject,
        default: ReportSubject.LIVESTREAM
    },
    reportSubjectId: String,
    reportContentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Report'
    },
    reportBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
},{
    collection: 'reports',
    timestamps: true,
});