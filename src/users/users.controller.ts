import { Controller, Get, Res, HttpCode, Param, BadRequestException, HttpStatus, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service'
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponse } from './responses/user.response';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { FindIdUserDto } from './dto/find-id.dto';
import { GetUserDto } from './dto/get-users.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';


@ApiTags('users')
@Controller('users')
export class UsersController {

    constructor( 
        private userService: UsersService,
    ){}

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
    async getCustomer( @Param('id', new MongoIdValidationPipe() ) id: string ): Promise<IResponse> {
        const find = await this.userService.findById(id);
        if (!find) throw new BadRequestException('User not found');
        return new ResponseSuccess( new UserResponse(find) )
    }


    @Delete(':id')
    @HttpCode( HttpStatus.OK )
    async deleteCustomer(@Res() res, @Param() params: FindIdUserDto) {
        const customer = await this.userService.delete( params.id )
        if (!customer) throw new BadRequestException('User does not exist')
        return res.json({
            success: true
        })
    }

}
