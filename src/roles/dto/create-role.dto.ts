import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber } from "class-validator";

export class CreateRoleDto {
    @ApiProperty()
    @IsNotEmpty()
    roleName: string;

    @ApiProperty()
    @IsNotEmpty()
    roleDisplayName: string;
}