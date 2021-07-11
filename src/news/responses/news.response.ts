import { ApiProperty } from "@nestjs/swagger";
import { CategoriesResponse } from "src/categories/responses/categories.response";
import { NewsCategoriesResponse } from "src/news-categories/responses/news-categories.response";
import { UserResponse } from "src/users/responses/user.response";
import * as moment from 'moment';


export class NewsItemResponse{
  
    constructor( object: any ){
        this.id = object.id ?? object._id;
        this.title = object.title;
        this.image = object.image;
        this.category = new NewsCategoriesResponse(object.category);
        this.createdAt = moment(object.createdAt).valueOf().toString();
        this.excerpt = object.excerpt;
        this.description = object.description;
        this.status = object.status;
        this.viewCount = object.viewCount;
        this.shareCount = object.shareCount;
        this.isHot = object.isHot;

    }
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    image: string;

    @ApiProperty()
    category: NewsCategoriesResponse;
    
    @ApiProperty()
    createdAt: string;
    
    @ApiProperty()
    excerpt: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    status: number;

    @ApiProperty()
    viewCount: number;

    @ApiProperty()
    shareCount: number;

    @ApiProperty()
    isHot: boolean;
}