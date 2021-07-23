import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class InviteDuetDto {
    
    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    userIdGuest: string;

    
}