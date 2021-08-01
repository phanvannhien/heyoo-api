import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateReadNotificationDto {
   
    @ApiProperty()
    @IsNotEmpty()
    notifyId: string;
    
}
