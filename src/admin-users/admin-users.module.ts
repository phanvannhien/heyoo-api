import { Module } from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
import { AdminUsersController } from './admin-users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminUserSchema } from './schemas/admin-user.schema';
import { CreateAdminUserCommand } from './create-admin-users.command';
import { CommandModule } from 'nestjs-command';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { AdminJwtStrategy } from './admin-jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'AdminUser', schema: AdminUserSchema }]),
    CommandModule,
    JwtModule.register({
      secret: jwtConstants.adminSecret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AdminUsersController],
  providers: [
    CreateAdminUserCommand,
    AdminUsersService,
    AdminJwtStrategy,
  ],
  exports: [
    AdminUsersService
  ]
})
export class AdminUsersModule {}
