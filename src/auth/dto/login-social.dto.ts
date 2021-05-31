import { IsIn, IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class LoginSocialDto{
    @ApiProperty({
        default: ''
    })
    @IsNotEmpty()
    access_token: string;

    @ApiProperty({
        enum: ['facebook','google','apple'],
        default: 'facebook'
    })
    @IsNotEmpty()
    @IsIn(['facebook','google','apple'])
    provider: string;
}