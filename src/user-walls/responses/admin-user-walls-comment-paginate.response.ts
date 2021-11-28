import { ApiProperty } from "@nestjs/swagger";
import { AdminUserWallCommentsItemResponse } from "./admin-user-walls-comment.response";

export class AdminUserWallCommentPaginateResponse{
  
    constructor( object: any ){
        this.total = object && object.total ? object.total.count : 0;
        this.items = object && object.items ? object.items.map( i => new AdminUserWallCommentsItemResponse(i) ) : [];
    }
   
    @ApiProperty()
    items: AdminUserWallCommentsItemResponse[];

    @ApiProperty()
    total: number;
}