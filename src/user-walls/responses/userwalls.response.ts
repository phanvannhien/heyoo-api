import { ApiProperty } from "@nestjs/swagger";
import { UserResponse } from "src/users/responses/user.response";
import * as moment from 'moment';
import { UserWallEntityDocument } from "../entities/user-wall.entity";


export class UserWallsItemResponse{
  
    constructor( object: any  ){
        this.id = object.id;
        this.caption = object.caption;
        this.images = object.images;
        this.status = object.status;
        this.viewCount = object.viewCount;
        this.shareCount = object.shareCount;
        this.likeCount = object.likeCount;
        this.postType = object.postType;
        this.createdAt = moment(object.createdAt).fromNow();
        this.isLiked = object.isLiked ?? false;
        this.liveStreamId = object.liveStreamId ?? null;
    }
    @ApiProperty()
    id: string;

    @ApiProperty()
    caption: string;

    @ApiProperty()
    images: string[];

    @ApiProperty()
    viewCount: number;

    @ApiProperty()
    shareCount: number;

    @ApiProperty()
    likeCount: number;

    @ApiProperty()
    status: number;

    @ApiProperty()
    postType: string;

    @ApiProperty()
    createdAt: String;

    @ApiProperty()
    isLiked: boolean;

    @ApiProperty()
    liveStreamId: boolean;
}
