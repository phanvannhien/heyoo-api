import { ApiProperty } from "@nestjs/swagger";
import { ReportContentItemResponse } from "./report-content.response";

export class ReportContentsResponse{
    constructor( object: any ){
        this.items = object && object.length > 0
            ? object.map( i => new ReportContentItemResponse(i) )
            : [];
    }
   
    @ApiProperty()
    items: ReportContentItemResponse[];
}