import * as mongoose from 'mongoose';
import {CreateConfigurationDto} from "../dto/create-configuration.dto";


export const defaultConfig = [
    {
        configKey: 'fakeNumberViewStep',
        configValue: '5'
    },
    {
        configKey: 'numberOfDateDeleteVideo',
        configValue: '7'
    },
    {
        configKey: 'dimamondToVNDRate',
        configValue: '1'
    },
] as CreateConfigurationDto[]

export const FAKE_NUMBER_VIEW_STEP = 'fakeNumberViewStep';
export const NUMBER_OF_DATE_DELETE_VIDEO = 'numberOfDateDeleteVideo';
export const DIAMOND_TO_VND_RATE = 'dimamondToVNDRate';

export const ConfigurationSchema = new mongoose.Schema({
    configKey: {
        type: String,
        require: true
    },
    configValue: String
},{
    collection: 'configurations'
});