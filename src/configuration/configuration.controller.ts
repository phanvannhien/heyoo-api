import { Controller, Query, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminJWTAuthGuard } from 'src/admin-users/admin-jwt-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { QueryPaginateDto } from 'src/common/dto/paginate.dto';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ConfigurationService } from './configuration.service';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { ConfigurationPaginateResponse } from './responses/configuration-paginate.response';


@ApiTags('admin')
@Controller('admin-configuration')
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {

  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  @HttpCode(HttpStatus.OK)
  async create(@Body() createConfigurationDto: CreateConfigurationDto): Promise<IResponse> {
    const data = await this.configurationService.create(createConfigurationDto);
    return new ResponseSuccess({ data: data });
  }

  @Post('create-default')
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  @HttpCode(HttpStatus.OK)
  async createDefaultConfig(): Promise<IResponse> {
    const data = await this.configurationService.createDefaultConfig();
    return new ResponseSuccess({ data: data });
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  @HttpCode(HttpStatus.OK)
  async findAll( @Query() query: QueryPaginateDto ): Promise<IResponse>  {
    const data = await this.configurationService.findAll(query);
    return new ResponseSuccess( new ConfigurationPaginateResponse(data) );
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<IResponse> {
    const data = this.configurationService.findOne(id);
    return new ResponseSuccess({ data: data });
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateConfigurationDto: UpdateConfigurationDto): Promise<IResponse> {
    const data = this.configurationService.update(id, updateConfigurationDto);
    return new ResponseSuccess({ data: data });
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<IResponse> {
    const data = await this.configurationService.remove(id);
    return new ResponseSuccess({ data: data });
  }
}

