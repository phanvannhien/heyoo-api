import { Document } from 'mongoose';

export interface ReportContentEntityDocument extends Document {
    reportContent: string;
}
