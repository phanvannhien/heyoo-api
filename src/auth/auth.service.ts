import { Injectable, UnauthorizedException, NotAcceptableException, HttpException, HttpStatus, BadRequestException, HttpService } from '@nestjs/common';
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
        private jwtService: JwtService,
        private httpService: HttpService
    ){}

    async verifyGoolgeTokenId( access_token ){
        try{
            const check = await this.httpService.get('https://oauth2.googleapis.com/tokeninfo', {
                params:{
                    id_token: access_token
                }
            }).toPromise();

            if( check.data.aud != process.env.GOOGLE_CLIENT_ID ){
                throw new BadRequestException('Google app is not valid')
            }

            return check;

        }catch{
            throw new BadRequestException('Can not verify token')
        }
    }

    getJWTPayload(user){
        return { phone: user.phone, sub: user._id, fullName: user.fullname, id: user._id };
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
        registerDto.isVerified = false;
        return await this.userService.createUser( registerDto );

    }
}
