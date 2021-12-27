import { ApiProperty } from "@nestjs/swagger";
import { PackageItemResponse } from "./package.response";

export class PackageItemsResponse{
    constructor( object: any ){
        this.items = object.map( i => new PackageItemResponse(i) );
    }
   
    @ApiProperty()
    items: PackageItemResponse[];
}