import { Module, Global } from '@nestjs/common';
import { LevelController } from './level.controller';
import { LevelService } from './level.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from 'src/files/files.module';
import { LevelSchema } from './schemas/level.schema';

@Global()
@Module({

  imports: [
    MongooseModule.forFeature([
      { name: 'Level', schema: LevelSchema },
    ]),
    FilesModule
  ],
  controllers: [LevelController],
  providers: [LevelService],
  exports:[
    LevelService
  ]
})
export class LevelModule {}
