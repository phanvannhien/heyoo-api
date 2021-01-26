import { Injectable, UnauthorizedException, NotAcceptableException } from '@nestjs/common';
import { UsersService } from "../users/users.service";
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create.user.dto';
import { LoginDto } from './dto/login.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/interfaces/user.interface';

@Injectable()
export class AuthService {
    constructor( 
        private userService: UsersService , 
        private jwtService: JwtService
    ){}

    async validateUser( phone: string, password: string ): Promise<User>{
        const user = await this.userService.findByPhone( phone );
        if( user && user.password == password ){
            return user;
        }
        return null;
    }

    async login( loginDto: LoginDto) {
        const user = await this.validateUser( loginDto.phone, loginDto.password )
        if( user ){
            const payload = { phone: user.phone, sub: user._id };
            return {
                access_token: this.jwtService.sign(payload),
                user: new UserDto(user)
            };
        }
        throw new UnauthorizedException()
    }
    
    
    async register( createUserDto: CreateUserDto ){
        const findUser = await this.userService.findByPhone( createUserDto.phone );
        if( findUser ){
            throw new NotAcceptableException("User "+createUserDto.phone+" already exists");
        }

        const user = await this.userService.createUser( createUserDto );
        const payload = { phone: user.phone, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
            user: new UserDto(user)
        };
    }
}
