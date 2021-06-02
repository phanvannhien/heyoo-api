import { ApiProperty } from "@nestjs/swagger";
import { UserResponse } from "src/users/responses/user.response";
import * as moment from 'moment';
import { ShopCategoriesResponse } from "src/shop-categories/responses/shop-categories.response";

export class ShopItemResponse{
  
    constructor( object: any ){
        this.id = object.id;
        this.shopName = object.shopName;
        this.image = object.image;
        this.phone = object.phone;
        this.email = object.email;
        this.location = object.location;
        this.description = object.description;
        this.phone = object.videoUrl;
        this.phone = object.videoUrl;
        this.phone = object.videoUrl;
        this.createdAt = moment(object.createdAt).fromNow();
        this.viewCount = object.viewCount;
        this.status = object.status;
        this.category = new ShopCategoriesResponse(object.category);
        this.user = new UserResponse(object.user);
    }
    @ApiProperty()
    id: String;

    @ApiProperty()
    shopName: String;

    @ApiProperty()
    image: String;
    
    @ApiProperty()
    phone: String;

    @ApiProperty()
    email: String;

    @ApiProperty()
    location: String;

    @ApiProperty()
    description: String;

    @ApiProperty()
    category: ShopCategoriesResponse;
    
    @ApiProperty()
    createdAt: String;
    
    @ApiProperty()
    viewCount: Number;

    @ApiProperty()
    status: Number;

    @ApiProperty()
    user: UserResponse;
}