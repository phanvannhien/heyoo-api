import { ApiProperty } from "@nestjs/swagger";
import { CategoriesResponse } from "src/categories/responses/categories.response";
import { NewsCategoriesResponse } from "src/news-categories/responses/news-categories.response";
import { UserResponse } from "src/users/responses/user.response";
import * as moment from 'moment';


export class NewsItemResponse{
  
    constructor( object: any ){
        this.id = object.id;
        this.title = object.title;
        this.image = object.image;
        this.category = new NewsCategoriesResponse(object.category);
        this.createdAt = moment(object.createdAt).fromNow();
        this.excerpt = object.excerpt;
        this.description = object.description;
        this.status = object.status;
        this.viewCount = object.viewCount;
        this.shareCount = object.shareCount;

    }
    @ApiProperty()
    id: String;

    @ApiProperty()
    title: String;

    @ApiProperty()
    image: String;

    @ApiProperty()
    category: NewsCategoriesResponse;
    
    @ApiProperty()
    createdAt: String;
    
    @ApiProperty()
    excerpt: String;

    @ApiProperty()
    description: String;

    @ApiProperty()
    status: Number;

    @ApiProperty()
    viewCount: Number;

    @ApiProperty()
    shareCount: Number;
}