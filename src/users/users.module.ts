import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/users.schema'
import { UsersController } from './users.controller';
import { FilesModule } from 'src/files/files.module';
import { LivestreamsModule } from 'src/livestreams/livestreams.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    FilesModule,
    LivestreamsModule
  ],
  providers:    [UsersService],
  controllers:  [UsersController],
  exports:      [UsersService],
})
export class UsersModule {}
