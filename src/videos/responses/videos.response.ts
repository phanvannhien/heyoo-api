import { ApiProperty } from "@nestjs/swagger";
import { CategoriesResponse } from "src/categories/responses/categories.response";
import { UserResponse } from "src/users/responses/user.response";
import { VideoCategoriesResponse } from "src/video-categories/responses/video-categories.response";
import * as moment from 'moment';


export class VideosItemResponse{
  
    constructor( object: any ){
        this.id = object.id;
        this.title = object.title;
        this.image = object.image;
        this.videoUrl = object.videoUrl;
        this.category = new VideoCategoriesResponse(object.category);
        this.createdAt = moment(object.createdAt).valueOf().toString();
        this.excerpt = object.excerpt;
        this.description = object.description;
        this.viewCount = object.viewCount;
        this.shareCount = object.shareCount;
        this.status = object.status;
    }
    @ApiProperty()
    id: String;

    @ApiProperty()
    title: String;

    @ApiProperty()
    image: String;
    
    @ApiProperty()
    videoUrl: String;

    @ApiProperty()
    category: VideoCategoriesResponse;
    
    @ApiProperty()
    createdAt: string;
    
    @ApiProperty()
    excerpt: String;

    @ApiProperty()
    description: String;

    @ApiProperty()
    viewCount: Number;

    @ApiProperty()
    shareCount: String;

    @ApiProperty()
    status: Number;
}