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
        this.startLiveAt = moment(object.startLiveAt).fromNow();
        this.endLiveAt = object.endLiveAt;
        this.categories = object.categories.map( i => new CategoriesResponse(i) ) ;
        this.streamer = new UserResponse(object.streamer);
        this.streamerUid = object.streamerUid;
        this.viewCount = object.viewCount ?? 0;
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

}