import { Controller, Get, Post, Body, Put, Param, Delete, BadRequestException, HttpStatus, HttpCode, Req, UseGuards } from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { LoginAdminDto } from './dto/login-admin-dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AdminUserResponse } from './responses/admin-user.response';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { AdminUserPaginateResponse } from './responses/admin-user-paginate.response';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';
import { RolesService } from 'src/roles/roles.service';

@ApiTags('admin-users')
@Controller('admin-users')
export class AdminUsersController {
  constructor(
    private readonly adminUsersService: AdminUsersService,
    private readonly jwtService: JwtService,
    private readonly roleService: RolesService,
    ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createAdminUserDto: CreateAdminUserDto): Promise<IResponse> {
    const data = await this.adminUsersService.create(createAdminUserDto);
    return new ResponseSuccess( new AdminUserResponse(data) )
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<IResponse> {
    const data = await this.adminUsersService.findAll();
    return new ResponseSuccess( new AdminUserPaginateResponse(data) )
  }

  @Get(':id/info')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getById( @Param('id', new MongoIdValidationPipe() ) id: string ): Promise<IResponse> {
    const data = await this.adminUsersService.findById(id);
    return new ResponseSuccess( new AdminUserResponse(data) );
  }

  @Get('info')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getInfo(@Req() req): Promise<IResponse> {
    const user = await this.adminUsersService.findById(req.user.id);
    const role = await this.roleService.findByRoleName( user.role );
    return new ResponseSuccess( new AdminUserResponse({
      ...user.toJSON(),
      perrmissions: role.permissions
    }));
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  async login( @Body() body: LoginAdminDto ){
    const user = await this.adminUsersService.findByEmail( body.username );
    if( !user ) throw new BadRequestException('User not found');
    if ( user.password != body.password ) throw new BadRequestException('Wrong password');
    const token = this.jwtService.sign( { email: user.email, sub: user._id }, { expiresIn: '7d' } )
    return {
      code: 200,
      data: {
        accessToken: token,
      }
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @UseGuards(JwtAuthGuard)
  async logout(){
    return {
      code: 200
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update( @Param('id', new MongoIdValidationPipe() ) id: string, @Body() updateAdminUserDto: UpdateAdminUserDto): Promise<IResponse> {
    const data = await this.adminUsersService.update(id, updateAdminUserDto);
    return new ResponseSuccess( new AdminUserResponse(data) );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove( @Param('id', new MongoIdValidationPipe() ) id: string): Promise<IResponse> {
    const data = await this.adminUsersService.remove(id);
    return new ResponseSuccess( data );
  }
}
