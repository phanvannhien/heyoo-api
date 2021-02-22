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


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRoot( MONGO_URI , { 
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }),
    AuthModule, 
    UsersModule, 
    AdminUsersModule, 
    RolesModule, 
    PermissionsModule,
    CommandModule,
    OptsModule,
    CategoriesModule,
    LivestreamsModule,
    
  ],
  controllers: [AppController],
  providers: [
    AppService,
   
  ],
})

export class AppModule {}
