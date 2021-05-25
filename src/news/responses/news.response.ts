import { ApiProperty } from "@nestjs/swagger";
import { CategoriesResponse } from "src/categories/responses/categories.response";
import { NewsCategoriesResponse } from "src/news-categories/responses/news-categories.response";
import { UserResponse } from "src/users/responses/user.response";

export class NewsItemResponse{
  
    constructor( object: any ){
        this.id = object.id;
        this.title = object.title;
        this.image = object.image;
        this.category = new NewsCategoriesResponse(object.category);
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
    category: NewsCategoriesResponse;
    
    @ApiProperty()
    createdAt: Date;
    
    @ApiProperty()
    description: String;
}