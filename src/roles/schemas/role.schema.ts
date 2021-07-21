import * as mongoose from 'mongoose';



export const RoleSchema = new mongoose.Schema({
    roleName: String,
    roleDisplayName: String,
    permissions: mongoose.Schema.Types.Array,
});