import { Module, forwardRef, Global } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/users.schema'
import { UsersController } from './users.controller';
import { FilesModule } from 'src/files/files.module';
import { LivestreamsModule } from 'src/livestreams/livestreams.module';
import { FollowSchema } from './schemas/follow.schema';
import { USER_FCMTOKEN_MODEL } from 'src/mongo-model.constance';
import { FcmTokenSchema } from './schemas/fcm-token.schema';
import { AdminUsersFrontController } from './admin-users.controller';
import { WithDrawSchema } from './schemas/withdraw.schema';


@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Follow', schema: FollowSchema },
      { name: 'WithDraw', schema: WithDrawSchema },
      { name: USER_FCMTOKEN_MODEL , schema: FcmTokenSchema },
    ]),
    FilesModule,
    LivestreamsModule,
  ],
  providers:    [UsersService],
  controllers:  [UsersController, AdminUsersFrontController],
  exports:      [UsersService],
})
export class UsersModule {}
