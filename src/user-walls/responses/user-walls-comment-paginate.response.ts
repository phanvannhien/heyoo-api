import { ApiProperty } from "@nestjs/swagger";
import { UserWallCommentsItemResponse } from "./user-walls-comment.response";

export class UserWallCommentPaginateResponse{
  
    constructor( object: any ){
        this.total = object.total;
        this.items = object.items.map( i => new UserWallCommentsItemResponse(i) );
    }
   
    @ApiProperty()
    items: UserWallCommentsItemResponse[];

    @ApiProperty()
    total: number;
}