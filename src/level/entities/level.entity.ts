import { Document } from 'mongoose';

export interface LevelEntityDocument extends Document {
    levelName: string;
    levelImage: string;
    minTarget: number;
}