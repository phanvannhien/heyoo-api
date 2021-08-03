import { ApiProperty } from "@nestjs/swagger";
import { ConfigurationItemResponse } from "./configuration.response";

export class ConfigurationPaginateResponse{
  
    constructor( object: any ){
        this.total = object.total.length > 0 ? object.total[0]?.count : 0;
        this.items = object.items.length > 0 ? object.items.map( i => new ConfigurationItemResponse(i) ): [];
    }
   
    @ApiProperty()
    items: ConfigurationItemResponse[];

    @ApiProperty()
    total: number;

}