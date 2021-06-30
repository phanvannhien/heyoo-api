import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'LiveStreams', schema: LiveStreamSchema },
      { name: 'LiveStreamMembers', schema: LiveStreamMemberSchema },

    ]),
    FilesModule,
    AgoraModule,
    UserWallsModule,
    LivestreamsModule,
    CategoriesModule,
    ShopModule
  ],
  controllers: [LivestreamsController],
  providers: [LivestreamsService],
  exports: [
    LivestreamsService
  ]
})
export class LivestreamsModule {}
