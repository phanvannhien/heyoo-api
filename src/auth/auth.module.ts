import { Module } from '@nestjs/common';
// modules
import { UsersModule } from "../users/users.module";
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// others class
import { jwtConstants } from './constants';

// others class services
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

// services
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports:[
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    LocalStrategy,
    JwtStrategy
  ],
  exports: [AuthService],
})
export class AuthModule {}
