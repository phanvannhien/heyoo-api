import { IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class LoginAppleDto{
    @ApiProperty({
        default: ''
    })
    @IsNotEmpty()
    access_token: string;
}