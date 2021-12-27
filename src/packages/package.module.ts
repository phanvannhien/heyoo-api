import { Module } from '@nestjs/common';
import { PackageController } from './package.controller';
import { PackageService } from './package.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from 'src/files/files.module';
import { PackageSchema } from './schemas/package.schema';
import { AdminPackageController } from './admin-package.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Package', schema: PackageSchema },
    ]),
    FilesModule
  ],
  controllers: [PackageController, AdminPackageController],
  providers: [PackageService],
  exports:[
    PackageService
  ]
})
export class PackageModule {}
