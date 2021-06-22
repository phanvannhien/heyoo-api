import { PartialType } from '@nestjs/swagger';
import { CreateUserWallDto } from './create-user-wall.dto';

export class UpdateUserWallDto extends PartialType(CreateUserWallDto) {}
