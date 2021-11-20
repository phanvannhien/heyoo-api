import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsUrl, Validate, ValidateIf } from "class-validator";

export class CreateUserWallCommentDto { 
    @ApiProperty({
        type: String,
        default: ''
    })
    @IsNotEmpty()
    comment: string;
 
    @ApiProperty({
        type: String,
        default: ''
    })
    @IsNotEmpty()
    @IsMongoId()
    wallId: string;
}