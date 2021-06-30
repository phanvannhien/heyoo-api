import { ApiProperty } from "@nestjs/swagger";
import { CategoriesResponse } from "src/categories/responses/categories.response";
import { UserResponse } from "src/users/responses/user.response";
import * as moment from 'moment';

export class ShopVideoItemResponse{
  
    constructor( object: any ){
        this.id = object.id ?? object._id;
        this.channelTitle = object.channelTitle;
        this.channelName = object.channelName;
        this.coverPicture = object.coverPicture;
        this.startLiveAt = moment(object.startLiveAt).valueOf().toString();
        this.endLiveAt = object.endLiveAt;
        this.streamer = new UserResponse(object.streamer);
        this.viewCount = object.viewCount ?? 0;
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
    viewCount: number;

    @ApiProperty()
    shop: string;

    @ApiProperty()
    videoUrl: string;
}