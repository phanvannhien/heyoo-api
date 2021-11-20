import { Module } from '@nestjs/common';
import { UserWallsService } from './user-walls.service';
import { UserWallsController } from './user-walls.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_WALL_LIKE_MODEL, USER_WALL_MODEL, USER_WALL_COMMENT_MODEL } from 'src/mongo-model.constance';
import { UserWallsSchema } from './schemas/user-walls.schema';
import { UserWallLikesSchema } from './schemas/user-wall-likes.schema';
import { AdminUserWallsController } from './admin-user-walls.controller';
import { UserWallCommentService } from './user-wall-comments.service';
import { UserWallCommentController } from './user-wall-comments.controller';
import { UserWallCommentSchema } from './schemas/user-wall-comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_WALL_MODEL, schema: UserWallsSchema },
      { name: USER_WALL_LIKE_MODEL, schema: UserWallLikesSchema },
      { name: USER_WALL_COMMENT_MODEL, schema: UserWallCommentSchema },
    ]),
  ],
  controllers: [UserWallsController, AdminUserWallsController, UserWallCommentController],
  providers: [
    UserWallsService,
    UserWallCommentService
  ],
  exports: [
    UserWallsService,
    UserWallCommentService
  ]
})
export class UserWallsModule {}
