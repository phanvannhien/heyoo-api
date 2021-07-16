import { Document } from 'mongoose';

export interface ConfigurationEntityDocument extends Document {
    readonly configKey: string;
    readonly configValue: string;
}
