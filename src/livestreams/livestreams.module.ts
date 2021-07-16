import { HttpModule, Module } from '@nestjs/common';
import { LivestreamsService } from './livestreams.service';
import { LivestreamsController } from './livestreams.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LiveStreamSchema, LiveStreamMemberSchema } from './schemas/livestream.schema';
import { FilesModule } from 'src/files/files.module';
import { AgoraModule } from 'src/agora/agora.module';
import { UserWallsModule } from 'src/user-walls/user-walls.module';
import { ShopService } from 'src/shop/shop.service';
import { ShopModule } from 'src/shop/shop.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { FirebaseCloudMessageModule } from 'src/firebase/firebase.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'LiveStreams', schema: LiveStreamSchema },
      { name: 'LiveStreamMembers', schema: LiveStreamMemberSchema },

    ]),
    FilesModule,
    AgoraModule,
    UserWallsModule,
    // LivestreamsModule,
    CategoriesModule,
    ShopModule,
    HttpModule,
    NotificationsModule,
    FirebaseCloudMessageModule,
  ],
  controllers: [LivestreamsController],
  providers: [LivestreamsService],
  exports: [
    LivestreamsService
  ]
})
export class LivestreamsModule {}
