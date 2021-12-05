import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsIn, IsInt, IsMongoId, IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";
import { ReportSubject } from "../schemas/report.schema";


export class CreateReportDto {
    @ApiProperty({
        default: ReportSubject.LIVESTREAM
    })
    @IsNotEmpty()
    @IsIn( Object.values(ReportSubject) )
    subject: string;

    @ApiProperty()
    @IsNotEmpty()
    reportSubjectId: string;

    @ApiProperty()
    @IsNotEmpty()
    reportContentId: string;
}