import { ApiProperty } from "@nestjs/swagger";
import { UserResponse } from "src/users/responses/user.response";
import * as moment from 'moment';
import { UserWallEntityDocument } from "../entities/user-wall.entity";
import { UserWallCommentsItemResponse } from "./user-walls-comment.response";


export class UserWallsItemResponse{
  
    constructor( object: any  ){
        this.id = object.id ?? object._id;
        this.caption = object.caption;
        this.images = object.images;
        this.status = object.status;
        this.viewCount = object.viewCount;
        this.shareCount = object.shareCount;
        this.likeCount = object.likeCount;
        this.postType = object.postType;
        this.createdAt = moment(object.createdAt).valueOf().toString();
        this.isLiked = object.isLiked ?? false;
        this.liveStreamId = object.liveStreamId ?? null;
        this.liveStreamStatus = object.liveStreamStatus ?? false;
        this.user = object.user ?? false;
        this.comment = object?.comments?.total?.length > 0 
            ? new UserWallCommentsItemResponse( object.comments.latest[0] )
            : null;
        this.commentCount = object?.comments?.total?.length > 0 ?  object.comments.total[0]['count'] : 0
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
    createdAt: string;

    @ApiProperty()
    isLiked: boolean;

    @ApiProperty()
    liveStreamId: string;

    @ApiProperty()
    liveStreamStatus: boolean;

    @ApiProperty()
    user: any;

    @ApiProperty()
    comment: any;

    @ApiProperty()
    commentCount: number;
}
