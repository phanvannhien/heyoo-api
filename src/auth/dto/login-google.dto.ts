import { IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class LoginGoogleDto{
    @ApiProperty({
        default: ''
    })
    @IsNotEmpty()
    access_token: string;
}