import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';


import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule }     from './auth/auth.module';
import { UsersModule }    from './users/users.module';
import { ConfigModule }   from '@nestjs/config';
import configuration      from './config/configuration';
import { MONGO_URI } from './app.constants';



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
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
