import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateLevelDto {
    @ApiProperty()
    @IsNotEmpty()
    levelName: string;

    @ApiProperty()
    @IsNotEmpty()
    levelImage: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    minTarget: number;

}