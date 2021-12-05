import { Controller, Post, UseInterceptors, Req, Body, UploadedFile, Delete,
    Get, Query, Put, Param, BadRequestException, UsePipes, UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { IResponse } from 'src/common/interfaces/response.interface';
import { LivestreamsService } from 'src/livestreams/livestreams.service';
import { NewsService } from 'src/news/news.service';
import { ReportContentService } from 'src/report-content/report-content.service';
import { ShopsResponse } from 'src/shop/responses/shop-paginate.response';
import { ShopService } from 'src/shop/shop.service';
import { UserWallsService } from 'src/user-walls/user-walls.service';
import { UsersService } from 'src/users/users.service';
import { VideosService } from 'src/videos/videos.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportService } from './report.service';
import { ReportItemResponse } from './responses/report.response';
import { ReportSubject } from './schemas/report.schema';

@ApiTags('report')
@Controller('report')
export class ReportController {

    constructor(
        private readonly reportService: ReportService,
        private readonly userService: UsersService,
        private readonly liveService: LivestreamsService,
        private readonly shopService: ShopService,
        private readonly userPostService: UserWallsService,
        private readonly videoService: VideosService,
        private readonly newsService: NewsService,
        private readonly reportContentService: ReportContentService,
    ) {}

    @ApiOkResponse({
        type: ReportItemResponse
    })
    @ApiBody({
        type: CreateReportDto
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post()
    async create( @Req() req, @Body() body: CreateReportDto): Promise<IResponse> {
        const dataCreate = {
            ...body,
            reportBy: req.user.id
        }

       
        const reportContent = await this.reportContentService.findById(body.reportContentId);
        if (!reportContent) throw new BadRequestException('Content to report not found');
        

        if( body.subject == ReportSubject.LIVESTREAM ){
            const findLiveStream = await this.liveService.findOne(body.reportSubjectId);
            if (!findLiveStream) throw new BadRequestException('Livestream not found');
        }

        if( body.subject == ReportSubject.SHOP ){
            const findShop = await this.shopService.findById(body.reportSubjectId);
            if (!findShop) throw new BadRequestException('Shop not found');
        }

        if( body.subject == ReportSubject.USER ){
            const findUser = await this.userService.findById(body.reportSubjectId);
            if (!findUser) throw new BadRequestException('User not found');
        }

        if( body.subject == ReportSubject.POST ){
            const findPost = await this.userPostService.findById(body.reportSubjectId);
            if (!findPost) throw new BadRequestException('Post not found');
        }

        if( body.subject == ReportSubject.NEWS ){
            const findNews = await this.newsService.findById(body.reportSubjectId);
            if (!findNews) throw new BadRequestException('News not found');
        }

        if( body.subject == ReportSubject.VIDEOS ){
            const findVideo = await this.videoService.findById(body.reportSubjectId);
            if (!findVideo) throw new BadRequestException('Video not found');
        }

        const data = await this.reportService.create(dataCreate);
        return new ResponseSuccess(new ReportItemResponse(data));
    }

}
