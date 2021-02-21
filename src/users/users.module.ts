import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/users.schema'
import { UsersController } from './users.controller';
import { FilesModule } from 'src/files/files.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    FilesModule
  ],
  providers:    [UsersService],
  controllers:  [UsersController],
  exports:      [UsersService],
})
export class UsersModule {}
