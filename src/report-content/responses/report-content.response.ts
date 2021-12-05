import { ApiProperty } from "@nestjs/swagger";

export class ReportContentItemResponse{
    constructor( object: any ){
        this.id = object.id ?? object._id;
        this.reportContent = object.reportContent;
    }
    @ApiProperty()
    id: string;

    @ApiProperty()
    reportContent: string;
}