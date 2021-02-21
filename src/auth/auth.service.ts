import { Injectable, UnauthorizedException, NotAcceptableException, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { UsersService } from "../users/users.service";
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create.user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/interfaces/user.interface';
import * as bcrypt from 'bcryptjs'; 
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor( 
        private userService: UsersService , 
        private jwtService: JwtService
    ){}

    getJWTPayload(user){
        return { phone: user.phone, sub: user._id };
    }

    async validateUser( phone: string, password: string ): Promise<User>{
        const user = await this.userService.findByPhone( phone );
        if( !user ) throw new BadRequestException("Phone not found" );
        
        var isValidPass = await bcrypt.compare(password, user.password);
        if( isValidPass ) return user;

        return null;
    }

    async login( loginDto: LoginDto): Promise<User> {
        const user = await this.validateUser( loginDto.phone, loginDto.password )
        if( !user ) throw new BadRequestException("Wrong phone or password" );
        return user;
    }
    
    async register( registerDto: RegisterDto ): Promise<User>{
        const findUser = await this.userService.findByPhone( registerDto.phone );
        if( findUser ){
            throw new BadRequestException("User "+registerDto.phone+" already exists");
        }
        registerDto.isVerified = true;
        return await this.userService.createUser( registerDto );

    }
}
