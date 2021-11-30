import { ApiProperty } from "@nestjs/swagger";
import { CategoriesResponse } from "src/categories/responses/categories.response";
import { UserResponse } from "src/users/responses/user.response";
import * as moment from 'moment';

export class LiveStreamItemResponse{
  
    constructor( object: any ){
        this.id = object.id ?? object._id;
        this.channelTitle = object.channelTitle;
        this.channelName = object.channelName;
        this.coverPicture = object.coverPicture;
        this.startLiveAt = moment(object.startLiveAt).valueOf().toString();
        this.endLiveAt = object.endLiveAt;
        this.categories = object.categories.map( i => new CategoriesResponse(i) ) ;
        this.streamer =  object.streamer ? new UserResponse(object.streamer) : null;
        this.streamerUid = object.streamerUid;
        this.viewCount = object.viewCount ?? 0;
        this.shop = object.shop ?? '';
        this.videoUrl = object.videoUrl ?? '';
        this.liveMode = object.liveMode ?? '';
        this.duetGuestUid = object.duetGuestUid ?? '';
        this.duetGuestId = object.duetGuestId ?? '';
        this.donateUid = object.donateUid ?? '';
    }
    @ApiProperty()
    id: string;

    @ApiProperty()
    channelTitle: string;

    @ApiProperty()
    channelName: string;

    @ApiProperty()
    categories: Array<CategoriesResponse>;

    @ApiProperty()
    coverPicture: string;

    @ApiProperty()
    startLiveAt: string;

    @ApiProperty()
    endLiveAt: Date;

    @ApiProperty()
    streamer: UserResponse;

    @ApiProperty()
    streamerUid: number;

    @ApiProperty()
    viewCount: number;

    @ApiProperty()
    shop: string;

    @ApiProperty()
    videoUrl: string;

    @ApiProperty()
    liveMode: string;

    @ApiProperty()
    duetGuestId: string;

    @ApiProperty()
    duetGuestUid: string;

    @ApiProperty()
    donateUid: string;
}