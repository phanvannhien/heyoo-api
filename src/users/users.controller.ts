import { Controller, Get, Res, Post, Req, Body } from '@nestjs/common';
import { UsersService } from './users.service'
import { User } from './interfaces/user.interface';
import { CreateUserDto } from "./dto/create.user.dto";

@Controller('users')
export class UsersController {

    constructor( private userService: UsersService ){}

    @Get()
    async getAll( @Res() res ) {
        const data = await this.userService.findAll();
        return res.json(data)
    }


    // Fetch a particular customer using ID
    // @Get('customer/:customerID')
    // async getCustomer(@Res() res, @Param('customerID') customerID) {
    //     const customer = await this.customerService.getCustomer(customerID);
    //     if (!customer) throw new NotFoundException('Customer does not exist!');
    //     return res.status(HttpStatus.OK).json(customer);

    // }

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

    // // Delete a customer
    // @Delete('/delete')
    // async deleteCustomer(@Res() res, @Query('customerID') customerID) {
    //     const customer = await this.customerService.deleteCustomer(customerID);
    //     if (!customer) throw new NotFoundException('Customer does not exist');
    //     return res.status(HttpStatus.OK).json({
    //         message: 'Customer has been deleted',
    //         customer
    //     })
    // }

}
