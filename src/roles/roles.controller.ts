import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';
import { AdminJWTAuthGuard } from 'src/admin-users/admin-jwt-auth.guard';

@ApiTags('admin')
@Controller('admin-roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  async create(@Body() createRoleDto: CreateRoleDto): Promise<IResponse> {
    const role = await this.rolesService.create(createRoleDto);
    return new ResponseSuccess( role );
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  async findAll(): Promise<IResponse> {
    const data = await this.rolesService.findAll();
    return new ResponseSuccess( data );
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  async findOne( @Param('id', new MongoIdValidationPipe() ) id: string): Promise<IResponse> {
    const data = await this.rolesService.findById(id);
    return new ResponseSuccess( data );
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  async update( @Param('id', new MongoIdValidationPipe() ) id: string, @Body() updateRoleDto: UpdateRoleDto): Promise<IResponse> {
    const data = this.rolesService.update(id, updateRoleDto);
    return new ResponseSuccess( data );
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  async remove(@Param('id', new MongoIdValidationPipe() ) id: string): Promise<IResponse>  {
    const data = await this.rolesService.remove(id);
    return new ResponseSuccess( data );
  }
}
