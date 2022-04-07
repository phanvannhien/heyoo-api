import { Document } from 'mongoose';

export interface DuetLiveStreamEntityDocument extends Document{
    readonly liveStream: string;
    readonly hostUser: string;
    readonly guestUser: string;
    status: string;
    inviteAt: Date,
    fcmTokens: string[];
}