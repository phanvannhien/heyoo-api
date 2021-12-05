import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber } from "class-validator";

export class CreateReportContentDto {
    @ApiProperty()
    @IsNotEmpty()
    reportContent: string;
}