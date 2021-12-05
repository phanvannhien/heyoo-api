import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsModule } from 'src/news/news.module';
import { ReportContentModule } from 'src/report-content/report-content.module';
import { VideosModule } from 'src/videos/videos.module';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { ReportSchema } from './schemas/report.schema';

@Module({ 
  imports: [
    MongooseModule.forFeature([
      { name: 'Report', schema: ReportSchema },
    ]),
    NewsModule,
    VideosModule,
    ReportContentModule
  ],
  controllers: [ReportController],
  providers: [ReportService],
  exports:[
    ReportService
  ]
})

export class ReportModule {}