import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateNewsCategoryDto {
    @ApiProperty()
    @IsNotEmpty()
    categoryName: String;
}
