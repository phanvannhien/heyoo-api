import { ApiProperty } from "@nestjs/swagger";
import moment = require("moment");

export class ConfigurationItemResponse{
  
    constructor( object: any ){
        this.id = object.id ?? object._id;
        this.configKey = object.configKey;
        this.configValue = object.configValue;
        
    }
    @ApiProperty()
    id: string;
    
    @ApiProperty()
    configKey: string; 
    
    @ApiProperty()
    configValue: string; 
}