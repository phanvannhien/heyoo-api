import { Controller, Get, UseGuards, Post, Request, Res, Body, 
  Query,
  ValidationPipe, 
  UsePipes,
  ClassSerializerInterceptor, 
  UseInterceptors,
  SerializeOptions
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { QueryPaginateDto } from './common/dto/paginate.dto';
import { ResponseSuccess } from './common/dto/response.dto';
import { IResponse } from './common/interfaces/response.interface';
import { SearchIdoDto } from './users/dto/search-ido.dto';
import { SearchIdosResponse } from './users/responses/search-idos.response';
import { UserResponse } from './users/responses/user.response';
import { UsersProfileResponse } from './users/responses/users-profile.response';
import { UsersResponse } from './users/responses/users.response';
import { UsersService } from './users/users.service';

@ApiTags('idols')
@Controller('idols')
export class IdolController {
  constructor(
    private readonly userService: UsersService
  ) {}

  @Get('search')
  @ApiOkResponse({
    type: SearchIdosResponse,
    description: 'Return array UserResponse'
  })
  async search( @Query() query: SearchIdoDto ): Promise<IResponse>{
    const data = await this.userService.searchByName(query);
    return new ResponseSuccess(new SearchIdosResponse(data[0]));
  }

  @Get('top-streamers')
  @ApiOkResponse({
    type: UsersProfileResponse,
    description: 'Return array UsersProfileResponse'
  })
  async getTopStreamers( @Query() query: QueryPaginateDto ): Promise<IResponse>{
    const data = await this.userService.getTopStreamers(query);

    return new ResponseSuccess(new UsersProfileResponse(data[0] ));
  }

  @ApiBearerAuth()
  @UseGuards( JwtAuthGuard )
  @Get('is-following')
  @ApiOkResponse({
    type: UsersProfileResponse,
    description: 'Return array UsersProfileResponse'
  })
  async getIsFollowing( @Request() req, @Query() query: QueryPaginateDto ): Promise<IResponse>{
    const data = await this.userService.getIsFollowing(req.user.id, query);
    return new ResponseSuccess(new UsersProfileResponse( data[0] ));
  }

}