import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsUrl } from "class-validator";

export class CreateNotificationTopicDto {
    @ApiProperty()
    @IsNotEmpty()
    body: string;

    @IsNotEmpty()
    @ApiProperty()
    chatRoomId: string;

    @ApiProperty()
    @IsNotEmpty()
    uid: string;
}
