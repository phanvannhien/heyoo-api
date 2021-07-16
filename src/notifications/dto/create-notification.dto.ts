import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsUrl } from "class-validator";

export class CreateNotificationDto {
    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    body: string;

    @ApiProperty({ 
        type: String,
        default: 'https://picsum.photos/200/200'
    })
    @IsNotEmpty()
    @IsUrl()
    imageUrl: string;

    @ApiProperty()
    @IsOptional()
    metaData: object;
    
    @ApiProperty()
    clickAction: string;

    @ApiProperty({
        type: Boolean,
        default: 0
    })
    isRead: boolean;

    @ApiProperty({
        type: Boolean,
        default: 0
    })
    @IsNotEmpty()
    user: string;

}
