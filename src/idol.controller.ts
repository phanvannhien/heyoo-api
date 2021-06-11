import { Controller, Get, UseGuards, Post, Request, Res, Body, 
  Query,
  ValidationPipe, 
  UsePipes,
  ClassSerializerInterceptor, 
  UseInterceptors,
  SerializeOptions
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseSuccess } from './common/dto/response.dto';
import { IResponse } from './common/interfaces/response.interface';
import { SearchIdoDto } from './users/dto/search-ido.dto';
import { SearchIdosResponse } from './users/responses/search-idos.response';
import { UserResponse } from './users/responses/user.response';
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
    return new ResponseSuccess(new SearchIdosResponse(data));
  }

}