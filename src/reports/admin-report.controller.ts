import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';
import { AdminJWTAuthGuard } from 'src/admin-users/admin-jwt-auth.guard';
import { ReportService } from './report.service';
import { AdminGetReportDto } from './dto/admin-get-report.dto';

@ApiTags('admin')
@Controller('admin-report')
export class AdminReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  async findAdminPaginate(  @Req() req, @Query() query: AdminGetReportDto ): Promise<IResponse> {
    const data = await this.reportService.findAdminPaginate(query);
    return new ResponseSuccess( data );
  }



  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  async remove(@Param('id', new MongoIdValidationPipe() ) id: string): Promise<IResponse>  {
    const data = await this.reportService.remove(id);
    return new ResponseSuccess( data );
  }
}
