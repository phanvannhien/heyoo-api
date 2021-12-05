import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ReportContentService } from './report-content.service';
import { CreateReportContentDto } from './dto/create-report-content.dto';
import { UpdateReportContentDto } from './dto/update-report-content.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';
import { ReportContentsResponse } from './responses/report-contents.response';
import { ReportContentItemResponse } from './responses/report-content.response';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('report')
@Controller('report-content')
export class ReportContentController {
  constructor(private readonly reportContentService: ReportContentService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<IResponse> {
    const data = await this.reportContentService.findAll();
    return new ResponseSuccess( new ReportContentsResponse(data) );
  }
}
