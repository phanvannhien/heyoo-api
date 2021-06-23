import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsUrl, Validate, ValidateIf } from "class-validator";

export class CreateUserWallDto { 
    @ApiProperty()
    @ValidateIf(o => o.images == null || o.images?.length <= 0)
    @IsNotEmpty()
    caption: string;

    @ApiProperty({ 
        type: String,
        default: ['https://picsum.photos/800/800', 'https://picsum.photos/800/800']
    })
    @ValidateIf(o => o.caption == '' || o.caption == null )
    @IsNotEmpty()
    @IsArray()
    images: string[];


    postType?: string; 
    liveStreamId?: string; 
    liveStreamStatus?: boolean; 
    user?: string;
}