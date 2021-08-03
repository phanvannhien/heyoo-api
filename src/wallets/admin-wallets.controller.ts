import { Controller, Get, Query, Param, BadRequestException, Post, UseGuards, Req, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOkResponse, ApiProperty } from '@nestjs/swagger';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import { WalletsService } from './wallets.service';
import { WalletItemsResponse } from './responses/wallets.response';
import { GetWalletsDto } from './dto/get-wallets.dto';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { WalletItemResponse } from './responses/wallet.response';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { LivestreamsService } from 'src/livestreams/livestreams.service';
import { AdminJWTAuthGuard } from 'src/admin-users/admin-jwt-auth.guard';
import { AdminJwtStrategy } from 'src/admin-users/admin-jwt.strategy';

@ApiTags('admin')
@Controller('admin-wallets')
export class AdminWalletsController {
    constructor(
        private readonly walletService: WalletsService,
        private readonly productService: ProductsService,
        private readonly userService: UsersService,
        private readonly liveStreamService: LivestreamsService,
    ){}

  
    @Get()
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    @ApiOkResponse({
        type: WalletItemsResponse,
        description: 'return all wallets with pagination'
    })
    async find( @Query() query: GetWalletsDto ): Promise<IResponse>{
        const d = await this.walletService.findAll(query);
        return new ResponseSuccess(new WalletItemsResponse(d));
    }

    @Get(':id')
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    @ApiOkResponse({
        type: WalletItemResponse,
        description: 'return wallets find by ID'
    })
    async getById( @Param('id', new MongoIdValidationPipe() ) id: string ): Promise<IResponse>{
        const d = await this.walletService.findById(id);
        return new ResponseSuccess(new WalletItemResponse(d));
    }

    @Get(':userId/get-in')
    @ApiOkResponse()
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    async getUserWalletIn( @Param('userId', new MongoIdValidationPipe() ) userId: string): Promise<IResponse>{

        const userFind = await this.userService.findById(userId)
        if(!userFind) throw new BadRequestException('User not found')
        const data = await this.walletService.getUserWalletIn(userId);
        return new ResponseSuccess(data);
    }

    @Get(':userId/get-out')
    @ApiOkResponse()
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    async getUserWalletOut( @Param('userId', new MongoIdValidationPipe() ) userId: string): Promise<IResponse>{

        const userFind = await this.userService.findById(userId)
        if(!userFind) throw new BadRequestException('User not found')
        const data = await this.walletService.getUserWalletOut(userId);
        return new ResponseSuccess(data);
    }

}
