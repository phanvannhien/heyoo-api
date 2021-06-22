import { Module } from '@nestjs/common';
import { UserWallsService } from './user-walls.service';
import { UserWallsController } from './user-walls.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_WALL_LIKE_MODEL, USER_WALL_MODEL } from 'src/mongo-model.constance';
import { UserWallsSchema } from './schemas/user-walls.schema';
import { UserWallLikesSchema } from './schemas/user-wall-likes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_WALL_MODEL, schema: UserWallsSchema },
      { name: USER_WALL_LIKE_MODEL, schema: UserWallLikesSchema },
    ]),
  ],
  controllers: [UserWallsController],
  providers: [UserWallsService],
  exports: [
    UserWallsService
  ]
})
export class UserWallsModule {}
