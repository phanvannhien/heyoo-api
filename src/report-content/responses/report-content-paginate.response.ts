import { ApiProperty } from "@nestjs/swagger";
import { ReportContentItemResponse } from "./report-content.response";

export class ReportContentPaginateResponse{
  
    constructor( object: any ){
        this.total = object.total ? object.total: 0;
        this.items = object.items && object.items.length > 0 
            ? object.items.map( i => new ReportContentItemResponse(i) )
            : [];
    }
   
    @ApiProperty()
    items: ReportContentItemResponse[];

    @ApiProperty()
    total: number;
}