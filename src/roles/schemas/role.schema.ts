import * as mongoose from 'mongoose';



export const RoleSchema = new mongoose.Schema({
    roleName: String,
    roleDisplayName: String,
    permissions: [{
        type: String
    }],
},{
    collection: 'roles'
});