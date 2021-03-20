import { Controller, Get, Post, Body, Put, Param, Delete, BadRequestException, HttpStatus, HttpCode, Req, UseGuards } from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { LoginAdminDto } from './dto/login-admin-dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('admin-users')
@Controller('admin-users')
export class AdminUsersController {
  constructor(
    private readonly adminUsersService: AdminUsersService,
    private readonly jwtService: JwtService
    ) {}

  @Post()
  async create(@Body() createAdminUserDto: CreateAdminUserDto): Promise<any> {
    return await this.adminUsersService.create(createAdminUserDto);
  }

  @Get()
  findAll() {
    return this.adminUsersService.findAll();
  }

  

  @ApiBearerAuth()
  @Get('info')
  @UseGuards(JwtAuthGuard)
  async getInfo(@Req() req) {
    const user = await this.adminUsersService.findById(req.user.id);
    return {
      code: 200,
      data: {
        roles: 'admin',
        name: 'Administration',
        avatar: '',
        introduction: 'This is supper admin'
      }
    } 
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
  async logout(){
    return {
      code: 200
    }
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAdminUserDto: UpdateAdminUserDto) {
    return this.adminUsersService.update(+id, updateAdminUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminUsersService.remove(+id);
  }
}
