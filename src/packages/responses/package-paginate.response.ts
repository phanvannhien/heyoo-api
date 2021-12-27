import { ApiProperty } from "@nestjs/swagger";
import { PackageItemResponse } from "./package.response";

export class PackageItemPaginateResponse{
    constructor( object: any ){
        this.total = object.total;
        this.items = object.items.map( i => new PackageItemResponse(i) );
    }
   
    @ApiProperty()
    items: PackageItemResponse[];

    @ApiProperty()
    total: number;
}