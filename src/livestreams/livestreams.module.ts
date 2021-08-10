import { HttpModule, Module, Global } from '@nestjs/common';
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
import { DuetLivestreamSchema } from './schemas/duet.schema';
import { DuetService } from './duet.service';
import { ProductsModule } from 'src/products/products.module';
import { AdminLivestreamsController } from './admin-livestreams.controller';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'LiveStreams', schema: LiveStreamSchema },
      { name: 'LiveStreamMembers', schema: LiveStreamMemberSchema },
      { name: 'Duet', schema: DuetLivestreamSchema },

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
    ProductsModule
  ],
  controllers: [LivestreamsController, AdminLivestreamsController],
  providers: [LivestreamsService, DuetService],
  exports: [
    LivestreamsService
  ]
})
export class LivestreamsModule {}
