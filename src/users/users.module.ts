import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/users.schema'
import { UsersController } from './users.controller';
import { FilesModule } from 'src/files/files.module';
import { LivestreamsModule } from 'src/livestreams/livestreams.module';
import { FollowSchema } from './schemas/follow.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Follow', schema: FollowSchema },
    ]),
    FilesModule,
    LivestreamsModule,
  ],
  providers:    [UsersService],
  controllers:  [UsersController],
  exports:      [UsersService],
})
export class UsersModule {}
