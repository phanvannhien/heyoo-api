import { IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class RegisterFcmTokenDto{

    @ApiProperty()
    @IsNotEmpty()
    fcmToken: string;
}