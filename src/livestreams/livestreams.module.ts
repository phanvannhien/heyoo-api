import { Module } from '@nestjs/common';
import { LivestreamsService } from './livestreams.service';
import { LivestreamsController } from './livestreams.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LiveStreamSchema } from './schemas/livestream.schema';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'LiveStreams', schema: LiveStreamSchema }]),
    FilesModule
  ],
  controllers: [LivestreamsController],
  providers: [LivestreamsService]
})
export class LivestreamsModule {}
