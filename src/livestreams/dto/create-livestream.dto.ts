import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateLivestreamDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    coverPicture: string;

    @ApiProperty()
    @IsNotEmpty()
    channelName: string;

    @ApiProperty()
    @IsNotEmpty()
    categories: string;

    @IsOptional()
    streamer: string;


}