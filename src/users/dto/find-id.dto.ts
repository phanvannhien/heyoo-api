import { IsNotEmpty, IsNumber, IsEmail, IsPhoneNumber, IsOptional, IsMongoId } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class FindIdUserDto{

    @ApiProperty({
        default: '60162923962c48134fc2efe2',
        required: false
    })
    @IsNotEmpty()
    @IsMongoId()
    id: string;

}