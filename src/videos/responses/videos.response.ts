import { ApiProperty } from "@nestjs/swagger";
import { CategoriesResponse } from "src/categories/responses/categories.response";
import { UserResponse } from "src/users/responses/user.response";
import { VideoCategoriesResponse } from "src/video-categories/responses/video-categories.response";

export class VideosItemResponse{
  
    constructor( object: any ){
        this.id = object.id;
        this.title = object.title;
        this.image = object.image;
        this.category = new VideoCategoriesResponse(object.category);
        this.createdAt = object.createdAt;
        this.description = object.description;
    }
    @ApiProperty()
    id: String;

    @ApiProperty()
    title: String;

    @ApiProperty()
    image: String;

    @ApiProperty()
    category: VideoCategoriesResponse;
    
    @ApiProperty()
    createdAt: Date;
    
    @ApiProperty()
    description: String;
}