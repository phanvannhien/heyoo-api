import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule }     from './auth/auth.module';
import { UsersModule }    from './users/users.module';
import { ConfigModule }   from '@nestjs/config';
import configuration      from './config/configuration';
import { MONGO_URI } from './app.constants';
import { AdminUsersModule } from './admin-users/admin-users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { CommandModule } from 'nestjs-command';
import { OptsModule } from './otps/otps.module';
import { CategoriesModule } from './categories/categories.module';
import { LivestreamsModule } from './livestreams/livestreams.module';
import { AgoraModule } from './agora/agora.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { WalletsModule } from './wallets/wallets.module';
import { TransactionModule } from './transaction/transaction.module';
import { NewsCategoriesModule } from './news-categories/news-categories.module';
import { NewsModule } from './news/news.module';
import { VideoCategoriesModule } from './video-categories/video-categories.module';
import { VideosModule } from './videos/videos.module';
import { ImageUploadModule } from './upload/upload.module';
import { ShopCategoriesModule } from './shop-categories/shop-categories.module';
import { ShopModule } from './shop/shop.module';
import { IdolController } from './idol.controller';
import { UserWallsModule } from './user-walls/user-walls.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { ChatModule } from './chat/chat.module';
import { LevelModule } from './level/level.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './schedule/TasksService';
import { ShopProductCategoryModule } from './shop-products-category/shop-products-category.module';
import { ShopProductsModule } from './shop-products/shop-products.module';
import { ReportModule } from './reports/report.module';
import { ReportContentModule } from './report-content/report-content.module';
import { PackageModule } from './packages/package.module';
import { PaymentModule } from './payment/payment.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),

    // MongooseModule.forRoot( MONGO_URI , { 
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   useCreateIndex: true,
    // }),

    MongooseModule.forRoot( MONGO_URI , {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      connectionFactory: (connection) => {
    
        connection.plugin(require('mongoose-delete'), {
          deletedAt : true,
          deletedBy: true,
          overrideMethods: true
        });
        return connection;
      }
    }),

    ImageUploadModule,
    AuthModule,
    UsersModule, 
    AdminUsersModule, 
    RolesModule, 
    PermissionsModule,
    CommandModule,
    OptsModule,
    CategoriesModule,
    LivestreamsModule,
    AgoraModule,
    ProductsModule,
    OrdersModule,
    WalletsModule,
    TransactionModule,
    NewsCategoriesModule,
    NewsModule,
    VideoCategoriesModule,
    VideosModule,
    ShopCategoriesModule,
    ShopModule,
    UserWallsModule,
    NotificationsModule,
    ConfigurationModule,
    ChatModule,
    LevelModule,
    ShopProductCategoryModule,
    ShopProductsModule,
    ReportContentModule,
    ReportModule,
    PackageModule,
    ScheduleModule.forRoot(),
    PaymentModule
  ],
  controllers: [
    AppController,
    IdolController
  ],
  providers: [
    AppService,
    TasksService
  ],
  exports: [
    AppService,
    
  ]
})

export class AppModule {}
