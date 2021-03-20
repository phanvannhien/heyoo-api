import { Controller, Get, Res, Post, Req, Body, HttpCode, Param, BadRequestException, HttpStatus, Delete, Query, UseInterceptors, UseGuards, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service'
import { User } from './interfaces/user.interface';
import { CreateUserDto } from "./dto/create.user.dto";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponse } from './responses/user.response';
import { FindUserDto } from './dto/find-user.dto';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { FindIdUserDto } from './dto/find-id.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { string } from 'yargs';
import { GetUserDto } from './dto/get-users.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {

    constructor( private userService: UsersService ){}

    @Get()
    @HttpCode(HttpStatus.OK )
    async getAll( @Res() res, @Query() queryParams: GetUserDto ){
         
        const data = await this.userService.findAll(queryParams);
        return res.json( {
            data: { 
                items: data,
                total: data.length
            }
        });
    }

    @ApiResponse({ type: UserResponse })
    @Get(':id')
    @HttpCode( HttpStatus.OK )
    async getCustomer( @Param() params: FindIdUserDto ): Promise<IResponse> {
        console.log(params)
        const find = await this.userService.findById(params.id);
        if (!find) throw new BadRequestException('User not found');
        return new ResponseSuccess( new UserResponse(find) )

    }


    // // add a customer
    // @Post('/create')
    // async addCustomer(@Res() res, @Body() createCustomerDTO: CreateCustomerDTO) {
    //     const customer = await this.customerService.addCustomer(createCustomerDTO);
    //     return res.status(HttpStatus.OK).json({
    //         message: "Customer has been created successfully",
    //         customer
    //     })
    // }

    // // Update a customer's details
    // @Put('/update')
    // async updateCustomer(@Res() res, @Query('customerID') customerID, @Body() createCustomerDTO: CreateCustomerDTO) {
    //     const customer = await this.customerService.updateCustomer(customerID, createCustomerDTO);
    //     if (!customer) throw new NotFoundException('Customer does not exist!');
    //     return res.status(HttpStatus.OK).json({
    //         message: 'Customer has been successfully updated',
    //         customer
    //     });
    // }

    
    @Delete(':id')
    @HttpCode( HttpStatus.OK )
    async deleteCustomer(@Res() res, @Param() params: FindIdUserDto) {
        const customer = await this.userService.delete( params.id );
        if (!customer) throw new BadRequestException('User does not exist');
        return res.json({
            success: true
        })
    }

}
