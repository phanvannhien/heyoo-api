import { ApiProperty } from "@nestjs/swagger";
import { LevelItemResponse } from "./level.response";

export class LevelItemsResponse{
  
    constructor( object: any ){
        this.total = object.length;
        this.items = object.map( i => new LevelItemResponse(i) );
    }
   
    @ApiProperty()
    items: LevelItemResponse[];

    @ApiProperty()
    total: number;
}