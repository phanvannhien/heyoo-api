import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserWallCommentDto {
    @ApiProperty({
        type: String,
        default: ''
    })
    @IsNotEmpty()
    comment: string;
}
