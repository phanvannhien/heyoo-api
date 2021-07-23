import { Global, Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleSchema } from './schemas/role.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'RoleModel', schema: RoleSchema }])
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [
    RolesService
  ]
})
export class RolesModule {}
