import { ApiProperty } from "@nestjs/swagger";
import { UserResponse } from "src/users/responses/user.response";
import * as moment from 'moment';
import { ShopCategoriesResponse } from "src/shop-categories/responses/shop-categories.response";
import { LiveStreamItemResponse } from "src/livestreams/responses/live-item.response";

export class ShopItemResponse{
  
    constructor( object: any ){
        this.id = object.id ?? object._id;
        this.shopName = object.shopName;
        this.image = object.image;
        this.phone = object.phone;
        this.email = object.email;
        this.location = object.location;
        this.description = object.description;
        this.createdAt = moment(object.createdAt).valueOf().toString();
        this.viewCount = object.viewCount;
        this.status = object.status;
        this.category = object.category ? new ShopCategoriesResponse(object.category) : null;
        this.user = object.user ?  new UserResponse(object.user) : null;
        this.followCount = object.followCount ?? 0;
        this.isLiveStreamNow = object.isLiveStreamNow ?? false;
        this.isFollow = object.isFollow ?? false;
        this.livestream = object.livestream ? new LiveStreamItemResponse(object.livestream) : null ;
        
    }
    @ApiProperty()
    id: string;

    @ApiProperty()
    shopName: string;

    @ApiProperty()
    image: string;
    
    @ApiProperty()
    phone: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    location: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    category: ShopCategoriesResponse;
    
    @ApiProperty()
    createdAt: string;
    
    @ApiProperty()
    viewCount: number;

    @ApiProperty()
    status: number;

    @ApiProperty()
    followCount: number;

    @ApiProperty()
    user: UserResponse;

    @ApiProperty()
    readonly isLiveStreamNow: boolean;

    @ApiProperty()
    readonly isFollow: boolean;

    @ApiProperty()
    livestream: object;


}