import { Module } from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
import { AdminUsersController } from './admin-users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminUserSchema } from './schemas/admin-user.schema';
import { CreateAdminUserCommand } from './create-admin-users.command';
import { CommandModule } from 'nestjs-command';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'AdminUser', schema: AdminUserSchema }]),
    CommandModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AdminUsersController],
  providers: [
    CreateAdminUserCommand,
    AdminUsersService 
  ],
  exports: [
    AdminUsersService
  ]
})
export class AdminUsersModule {}
