import { Controller, Get, UseGuards, Post, Request, Res, Body, 
    ValidationPipe, 
    UsePipes,
    ClassSerializerInterceptor, 
    UseInterceptors,
    SerializeOptions,
    HttpStatus,
    HttpCode,
    HttpException
} from '@nestjs/common';

import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
// DTO 
import { LoginDto } from "./dto/login.dto";
import { CreateUserDto } from '../users/dto/create.user.dto';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SID, TWILIO_FROM_PHONE } from 'src/app.constants';
import { UsersService } from 'src/users/users.service';
import { randomOTP } from 'src/common/utils/opt.utils';
import { VerifyDto } from './dto/verify.dto';

const clientTwilio = require('twilio')( TWILIO_ACCOUNT_SID , TWILIO_AUTH_TOKEN);

@Controller('auth')
export class AuthController{
    constructor(
        private authService: AuthService,
        private userService: UsersService
    ) {}
    

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return await this.authService.login(loginDto);
    }

    @Post('register')
    @HttpCode(HttpStatus.OK)
    async register( @Body() createUserDto: CreateUserDto ): Promise<IResponse>{
        const OtpNumber = randomOTP();
        createUserDto.otp = OtpNumber;
        createUserDto.otpCreatedAt = new Date();
        const payload = await this.authService.register( createUserDto );
        try{
            const message = await clientTwilio.messages
            .create({
                body: OtpNumber,
                from: TWILIO_FROM_PHONE,
                to: createUserDto.phone
            })
            .then( message => message)
        }catch(error){

        }
        
        return new ResponseSuccess("USER_REGISTERED_SUCCESSFULLY", payload );
    
    }

    @UseGuards(JwtAuthGuard)
    @Post('otp')
    async otp(@Request() req): Promise<IResponse> {
    
        const user = await this.userService.findById( req.user.id );
        if( user.isVerified ) throw new HttpException("USER_IS_VERIFIED", HttpStatus.BAD_REQUEST );
        
        try{
            const OtpNumber = randomOTP();
            const updateDto = {
                otp: OtpNumber,
                otpCreatedAt: new Date()
            }
            await this.userService.updateUser( user._id, updateDto );
            const message = await clientTwilio.messages
                .create({
                    body: OtpNumber,
                    from: TWILIO_FROM_PHONE,
                    to: user.phone
                })
                .then( message => message )
            return new ResponseSuccess("SEND_OPT_SUCCESS", message );

        }catch(error){
            return new ResponseError("SEND_OPT_FAIL", error);
        }    
    }


    @UseGuards(JwtAuthGuard)
    @Post('verify')
    async verify(@Request() req, @Body() body: VerifyDto ): Promise<IResponse> {
        const user = await this.userService.findById( req.user.id );
        if( user.isVerified ) return new ResponseSuccess("USER_IS_VERIFIED", user );
        
        if( user.otp === body.otp ){
            console.log(body);
            const updateDto = {
                isVerified: true
            }
            const updatedUser = await this.userService.updateUser( user._id, updateDto );
            return new ResponseSuccess("USER_IS_VERIFIED", updatedUser );
        }

        throw new HttpException("OPT_INVALID", HttpStatus.BAD_REQUEST);
        

    }


    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

}