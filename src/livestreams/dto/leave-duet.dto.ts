import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class LeaveDuetDto {
    
    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    userIdHost: string;

}