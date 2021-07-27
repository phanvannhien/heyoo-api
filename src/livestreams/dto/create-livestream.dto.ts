import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsOptional, ValidateIf } from "class-validator";

export class CreateLivestreamDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    coverPicture: string;

    @ApiProperty()
    @IsNotEmpty()
    channelTitle: string;

    @ApiProperty()
    @IsNotEmpty()
    categories: string;

    streamer?: string;
    streamerUid?: number;

    @ApiProperty({
        type: String,
        required: false,
    })
    @IsOptional()
    shop?: string;

    @ApiProperty({
        type: String,
        required: false,
        default: 'single'
    })
    @IsOptional()
    @IsIn(['single','duet'])
    liveMode: string;

}