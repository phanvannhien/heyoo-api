import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateShopProductCategoryDto {
    @ApiProperty()
    @IsNotEmpty()
    categoryName: String;
}
