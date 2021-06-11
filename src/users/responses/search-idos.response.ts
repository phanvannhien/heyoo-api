import { ApiProperty } from "@nestjs/swagger";
import { SearchIdoResponse } from "./search-ido.response";

export class SearchIdosResponse{
    constructor( object: any ){
        this.total = object.length;
        this.items = object.map( i => new SearchIdoResponse(i) );
    }
   
    @ApiProperty()
    items: SearchIdoResponse[];

    @ApiProperty()
    total: number;
}