import { IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class LoginFacebookDto{
    @ApiProperty({
        default: ''
    })
    @IsNotEmpty()
    access_token: string;
}