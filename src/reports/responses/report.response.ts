import { ApiProperty } from "@nestjs/swagger";

export class ReportItemResponse{
  
    constructor( object: any ){
        this.id = object.id ?? object._id;
        this.subject = object.subject;
        this.reportSubjectId = object.reportSubjectId;
        this.reportContentId = object.reportContentId;
        this.createdAt = object.createdAt;
    }
    @ApiProperty()
    id: string;

    @ApiProperty()
    subject: string;

    @ApiProperty()
    reportSubjectId: string;

    @ApiProperty()
    reportContentId: string;

    @ApiProperty()
    reportBy: string;
    
    @ApiProperty()
    createdAt: string;
}