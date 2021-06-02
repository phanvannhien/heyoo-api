import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateShopCategoryDto {
    @ApiProperty()
    @IsNotEmpty()
    categoryName: String;
}
