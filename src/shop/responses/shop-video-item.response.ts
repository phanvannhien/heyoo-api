import { ApiProperty } from "@nestjs/swagger";
import { UserResponse } from "src/users/responses/user.response";
import * as moment from 'moment';
import { ShopCategoriesResponse } from "src/shop-categories/responses/shop-categories.response";

export class ShopVideoItemResponse{
  
    constructor( object: any ){
        this.id = object.id ?? object._id;
        this.channelTitle = object.channelTitle;
        this.channelName = object.channelName;
        this.coverPicture = object.coverPicture;
        this.startLiveAt = moment(object.startLiveAt).valueOf().toString();
        this.endLiveAt = object.endLiveAt;
        this.streamer = new UserResponse(object.streamer);
        this.category = {
            id: object.category.id ?? object.category._id,
            categoryName: object.category.categoryName
        };
        this.viewCount = object.viewCount ?? 0;
        this.streamerUid = object.streamerUid;
        this.shop = object.shop ?? '';
        this.videoUrl = object.videoUrl ?? '';
    }
    @ApiProperty()
    id: string;

    @ApiProperty()
    channelTitle: string;

    @ApiProperty()
    channelName: string;

    @ApiProperty()
    coverPicture: string;

    @ApiProperty()
    startLiveAt: string;

    @ApiProperty()
    endLiveAt: Date;

    @ApiProperty()
    streamer: UserResponse;

    @ApiProperty()
    category: ShopCategoriesResponse;

    @ApiProperty()
    streamerUid: number;

    @ApiProperty()
    viewCount: number;

    @ApiProperty()
    shop: string;

    @ApiProperty()
    videoUrl: string;
}