import { Controller, 
  Get, Post, Body, Patch, 
  Param, Delete, UseGuards, 
  Req, Query, BadRequestException, 
  Put } from '@nestjs/common';
import { UserWallCommentService } from './user-wall-comments.service';
import { CreateUserWallCommentDto } from './dto/create-user-wall-comment.dto';
import { UpdateUserWallCommentDto } from './dto/update-user-wall-comment.dto';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IResponse } from 'src/common/interfaces/response.interface';
import { UserWallCommentsItemResponse } from './responses/user-walls-comment.response';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { UserWallCommentPaginateResponse } from './responses/user-walls-comment-paginate.response';
import { GetUserWallCommentDto } from './dto/get-user-wall-comment.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';
import { UserWallCommentEntityDocument } from './entities/user-wall-comment.entity';
import { AdminJWTAuthGuard } from 'src/admin-users/admin-jwt-auth.guard';
import { UserWallsService } from './user-walls.service';
import { UserWallsResponse } from './responses/userwalls-paginate.response';

@ApiTags('user-wall-comments')
@Controller('user-wall-comments')
export class UserWallCommentController {
  constructor(
    private readonly userWallCommentService: UserWallCommentService,
    private readonly userWallService: UserWallsService,
    ) {}

  @ApiBearerAuth()
  @Post()
  @ApiBody({ type: CreateUserWallCommentDto })
  @UseGuards(JwtAuthGuard)
  async create( @Req() request, @Body() createWallCommentDto: CreateUserWallCommentDto): Promise<IResponse> {
    const postWall = await this.userWallService.findById( createWallCommentDto.wallId );
    if( !postWall ) throw new BadRequestException('Post wall not found');
    const create = await this.userWallCommentService.create({
      comment: createWallCommentDto.comment,
      user: request.user.id,
      wall: createWallCommentDto.wallId
    });
    console.log(create);
    return new ResponseSuccess( new UserWallCommentsItemResponse( create ) );
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
      type: UserWallCommentPaginateResponse
  })
  async find( @Req() request, @Query() query: GetUserWallCommentDto ): Promise<IResponse>{
    const { total, items } = await this.userWallCommentService.findPaginate(query);
    return new ResponseSuccess( new UserWallCommentPaginateResponse( { total, items } ));
  }


  @ApiOkResponse({ type: UserWallCommentsItemResponse  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(
    @Req() request,
    @Param('id', new MongoIdValidationPipe() ) id: string
  ): Promise<IResponse>{
    const find: UserWallCommentEntityDocument = await this.userWallCommentService.findById(id);
    if( !find ) throw new BadRequestException('Not found');
    return new ResponseSuccess(new UserWallCommentsItemResponse(find));
  }


  @ApiOkResponse({ type: UserWallCommentsItemResponse })
  @ApiBody({ type: UpdateUserWallCommentDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
        @Req() request, 
        @Param('id', new MongoIdValidationPipe() ) id: string,
        @Body() body: UpdateUserWallCommentDto
      ): Promise<IResponse> {
      const find = await this.userWallCommentService.findById(id);
      if( !find ) throw new BadRequestException('Not found');

      if( request.user.id != find.user['_id'] ){
        throw new BadRequestException('You do not have role to update');
      }

      const data = await this.userWallCommentService.update( id, {
        ...body,
        updatedAt: Date.now()
      });

      return new ResponseSuccess(new UserWallCommentsItemResponse(data));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', new MongoIdValidationPipe() ) id: string) {
    await this.userWallCommentService.remove(id);
    return new ResponseSuccess({
      deleted: true
    })
  }


}
