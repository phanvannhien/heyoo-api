import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ReportContentService } from './report-content.service';
import { CreateReportContentDto } from './dto/create-report-content.dto';
import { UpdateReportContentDto } from './dto/update-report-content.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';
import { AdminJWTAuthGuard } from 'src/admin-users/admin-jwt-auth.guard';
import { ReportContentsResponse } from './responses/report-contents.response';
import { ReportContentItemResponse } from './responses/report-content.response';

@ApiTags('admin')
@Controller('admin-report-content')
export class AdminReportContentController {
  constructor(private readonly reportContentService: ReportContentService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  async create(@Body() createRoleDto: CreateReportContentDto): Promise<IResponse> {
    const item = await this.reportContentService.create(createRoleDto);
    return new ResponseSuccess( new ReportContentItemResponse(item) );
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  async findAll(): Promise<IResponse> {
    const data = await this.reportContentService.findAll();
    return new ResponseSuccess( new ReportContentsResponse(data) );
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  async findOne( @Param('id', new MongoIdValidationPipe() ) id: string): Promise<IResponse> {
    const data = await this.reportContentService.findById(id);
    return new ResponseSuccess( data );
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  async update( @Param('id', new MongoIdValidationPipe() ) id: string, @Body() updateRoleDto: UpdateReportContentDto): Promise<IResponse> {
    const data = this.reportContentService.update(id, updateRoleDto);
    return new ResponseSuccess( data );
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  async remove(@Param('id', new MongoIdValidationPipe() ) id: string): Promise<IResponse>  {
    const data = await this.reportContentService.remove(id);
    return new ResponseSuccess( data );
  }
}
