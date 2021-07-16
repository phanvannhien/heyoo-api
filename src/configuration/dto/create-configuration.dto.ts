import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateConfigurationDto {
    @ApiProperty()
    @IsNotEmpty()
    configKey: string;

    @ApiProperty()
    @IsNotEmpty()
    configValue: string;
}