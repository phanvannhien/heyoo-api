import * as mongoose from 'mongoose';

export const ConfigurationSchema = new mongoose.Schema({
    configKey: {
        type: String,
        require: true
    },
    configValue: String
},{
    collection: 'configurations'
});