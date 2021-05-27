import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateVideoCategoryDto {
    @ApiProperty()
    @IsNotEmpty()
    categoryName: String;
}
