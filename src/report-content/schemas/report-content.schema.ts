import * as mongoose from 'mongoose';

export const ReportContentSchema = new mongoose.Schema({
    reportContent: String
},{
    collection: 'report_contents',
    timestamps: true,
});