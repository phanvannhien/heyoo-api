import { Document } from 'mongoose';

export interface RoleEntityDocument extends Document {
    roleName: string;
    roleDisplayName: string;
    permissions: string[]
}
