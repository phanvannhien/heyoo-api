import { Global, Module } from '@nestjs/common';
import { ReportContentService } from './report-content.service';
import { ReportContentController } from './report-content.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportContentSchema } from './schemas/report-content.schema';
import { AdminReportContentController } from './admin-report-content.controller';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ReportContent', schema: ReportContentSchema }])
  ],
  controllers: [
    ReportContentController, 
    AdminReportContentController
  ],
  providers: [ReportContentService],
  exports: [
    ReportContentService
  ]
})
export class ReportContentModule {}
