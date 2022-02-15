import { ApiProperty } from "@nestjs/swagger";
import { CategoriesResponse } from "src/categories/responses/categories.response";
import { UserResponse } from "src/users/responses/user.response";
import { VideoCategoriesResponse } from "src/video-categories/responses/video-categories.response";
import * as moment from 'moment';


export class VideosItemResponse{
  
    constructor( object: any ){
        this.id = object.id ??  object._id ;
        this.title = object.title;
        this.image = object.image;
        this.videoUrl = object.videoUrl;
        this.category = object.category ? new VideoCategoriesResponse(object.category) : null;
        this.createdAt =  new Date(object.createdAt).getTime().toString();
        this.excerpt = object.excerpt;
        this.description = object.description;
        this.viewCount = object.viewCount;
        this.shareCount = object.shareCount;
        this.status = object.status;
        this.isHot = object.isHot;
        
    }
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    image: string;
    
    @ApiProperty()
    videoUrl: string;

    @ApiProperty()
    category: VideoCategoriesResponse;
    
    @ApiProperty()
    createdAt: string;
    
    @ApiProperty()
    excerpt: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    viewCount: number;

    @ApiProperty()
    shareCount: string;

    @ApiProperty()
    status: number;

    @ApiProperty()
    isHot: boolean;
}