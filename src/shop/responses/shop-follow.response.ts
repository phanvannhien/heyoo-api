import { ApiProperty } from "@nestjs/swagger";

export class ShopFollowResponse{
    
    constructor( object: any ){
        this.id = object.id;
        this.shop = object.shop ;
        this.user = object.user;
        this.createdAt  = object.createdAt;
    }
    @ApiProperty()
    readonly id: string;

    @ApiProperty()
    readonly shop: string;

    @ApiProperty()
    readonly user: string;

    @ApiProperty()
    readonly createdAt: Date;

}