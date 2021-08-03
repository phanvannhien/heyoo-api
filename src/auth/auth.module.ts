import { HttpModule, Module } from '@nestjs/common';
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
import { FacebookStrategy } from './facebook.strategy';
import { GoogleAuthStrategy } from './google.strategy';
import { AppleStrategy } from './apple.strategy';
import { GoogleVerifyTokenStrategy } from './strategies/google.strategy';

@Module({
  imports:[
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    LocalStrategy,
    JwtStrategy,
    FacebookStrategy,
    GoogleAuthStrategy,
    AppleStrategy, 
    GoogleVerifyTokenStrategy
  ],
  exports: [AuthService],
})
export class AuthModule {}
