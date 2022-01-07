import { IsIn, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { WithDrawStatus } from "../schemas/withdraw.schema";

export class AdminUpdateWithDrawDto{
    @ApiProperty()
    @IsIn( Object.values( WithDrawStatus ) )
    @IsOptional()
    status: string;
}