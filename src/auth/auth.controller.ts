import { Controller, Get, UseGuards, Post, Request, Res, Body, 
    ValidationPipe, 
    UsePipes,
    ClassSerializerInterceptor, 
    UseInterceptors,
    SerializeOptions,
    HttpStatus,
    HttpCode,
    HttpException,
    BadRequestException,
    Req,
    Param,
    UploadedFile
} from '@nestjs/common';

import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service'; 
import { LoginDto } from "./dto/login.dto";
import { CreateUserDto } from '../users/dto/create.user.dto';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SID, TWILIO_FROM_PHONE, SALT_ROUNDS } from 'src/app.constants';
import { UsersService } from 'src/users/users.service';
import { randomOTP } from 'src/common/utils/opt.utils';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import * as bcrypt from 'bcryptjs'; 
import { ForgotPasswordDto } from './dto/forgot.dto';
import { LoginFacebookDto } from './dto/login-facebook.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponse } from './responses/auth.response';
import { UserResponse } from 'src/users/responses/user.response';
import { LoginGoogleDto } from './dto/login-google.dto';
import { LoginAppleDto } from './dto/login-apple.dto';
import { UserProfileResponse } from './responses/profile.response';
import { UpdateAvatarDto } from 'src/users/dto/update-avatar.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProfileDto } from './dto/update-profile.dto';

const clientTwilio = require('twilio')( TWILIO_ACCOUNT_SID , TWILIO_AUTH_TOKEN);

@ApiTags('auth')
@Controller('auth')
export class AuthController{
    constructor(
        private authService: AuthService,
        private userService: UsersService,
        private jwtService: JwtService
    ) {}
    

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: AuthResponse,
    })
    async login(@Body() loginDto: LoginDto): Promise<IResponse> {
        const user = await this.authService.login(loginDto);
        return new ResponseSuccess( new AuthResponse({
            accessToken: this.jwtService.sign( this.authService.getJWTPayload(user), { expiresIn: '7d' } ),
            user: user
        }));
    }

    @ApiOkResponse({
        type: AuthResponse,
    })
    @UseGuards(AuthGuard('facebook-token'))  
    @Post('login-facebook')
    async getTokenAfterFacebookSignIn(@Request() req, @Body() loginFacebookDto: LoginFacebookDto ) {
        try{
            const socialUser = req.user;
           
            const user = await this.userService.findOrCreateFacebookId( socialUser );
            return new ResponseSuccess( new AuthResponse({
                accessToken: this.jwtService.sign( this.authService.getJWTPayload(user) , { expiresIn: '7d' }),
                user: user
            }));
        }catch(err){
            throw new BadRequestException( err )
        }
    }

    @ApiOkResponse({
        type: AuthResponse,
    })
    // @UseGuards(AuthGuard('google-verify-token'))  
    @Post('login-google')
    @HttpCode(HttpStatus.OK)
    async getTokenAfterGoogleSignIn( @Body() body: LoginGoogleDto ): Promise<IResponse> {

        const socialUser = this.parseJwt( body.access_token ) ;
        const user = await this.userService.findOrCreateGoogleId( socialUser );

        return new ResponseSuccess( new AuthResponse({
            accessToken: this.jwtService.sign( this.authService.getJWTPayload(user), { expiresIn: '7d' } ),
            user: user
        }));

    }


    parseJwt(token) {
        const base64Payload = token.split('.')[1];
        const payload = Buffer.from(base64Payload, 'base64');
        return JSON.parse(payload.toString());
    }

    @ApiOkResponse({
        type: AuthResponse,
    })
    // @UseGuards(AuthGuard('apple-verify-token'))
    @Post('login-apple')
    @HttpCode(HttpStatus.OK)
    async loginWithApple(@Req() req, @Body() body: LoginAppleDto ): Promise<IResponse> {
        // const socialUser = req.user;
        const socialUser = this.parseJwt( body.access_token ) ;
        const user = await this.userService.findOrCreateAppleId( socialUser );
        return new ResponseSuccess( new AuthResponse({
            accessToken: this.jwtService.sign( this.authService.getJWTPayload(user), { expiresIn: '7d' } ),
            user: user
        }));

    }



    @ApiCreatedResponse({
        type: AuthResponse
    })
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register( @Body() registerDto: RegisterDto ): Promise<IResponse>{

        registerDto.password = await bcrypt.hash(registerDto.password, SALT_ROUNDS );
        const user = await this.authService.register( registerDto );

        return new ResponseSuccess( new AuthResponse({
            accessToken: this.jwtService.sign(this.authService.getJWTPayload(user) , { expiresIn: '7d' }),
            user: user
        }));
    
    }

    

    @ApiOkResponse({
        type: UserProfileResponse,
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @HttpCode(HttpStatus.OK)
    async getProfile(@Request() req): Promise<IResponse>  {
        const user = await this.userService.getProfile(req.user.id);
        if( user.length <= 0 ){
            throw new BadRequestException('User not found')
        }
        return new ResponseSuccess( new UserProfileResponse(user[0]) );
    }

    @ApiOkResponse({
        type: UserProfileResponse,
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('profile')
    @HttpCode(HttpStatus.OK)
    async updateProfile(@Request() req, @Body() body: UpdateProfileDto ): Promise<IResponse>  {
        await this.userService.updateUser(req.user.id, body );
        const user = await this.userService.getProfile(req.user.id);
        return new ResponseSuccess( new UserProfileResponse(user[0]) );
    }

    @ApiBearerAuth()
    @ApiOkResponse({ type: UserProfileResponse })
    @ApiBody({
        type: UpdateAvatarDto
    })
    @ApiConsumes('multipart/form-data')
    @Post('update-avatar')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async addAvatar(@Req() request, @UploadedFile() file): Promise<IResponse> {
        const user = await this.userService.updateAvatar(request.user.id, file.buffer, file.originalname);
        return new ResponseSuccess(new UserProfileResponse(user));
    }


    @ApiOkResponse({
        type: UserResponse,
    })
    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    async forgotPassword( @Body() body: ForgotPasswordDto ){
        const user = await this.userService.findByPhone( body.phone );
        if(!user) throw new BadRequestException('User not found');
        const updateDto = {
            password: await bcrypt.hash(body.password, SALT_ROUNDS )
        }
        await this.userService.updateUser( user._id, updateDto );
        return new ResponseSuccess( new UserResponse(user) );
    }


}