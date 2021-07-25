import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, Min } from "class-validator";

export class CreateLevelDto {
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