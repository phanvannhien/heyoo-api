import { ApiProperty } from "@nestjs/swagger";
import { CategoriesResponse } from "src/categories/responses/categories.response";
import { UserResponse } from "src/users/responses/user.response";
import { LiveStreamItemResponse } from "./live-item.response";
import { LiveMemerInfoResponse } from "./live-member-info.response";

export class LiveMemerLeaveResponse{
  
    constructor( object: any ){
        this.stream = new LiveStreamItemResponse(object.stream);
        this.joinInfo = new LiveMemerInfoResponse(object.joinInfo)
    }

    @ApiProperty()
    stream: LiveStreamItemResponse;

    @ApiProperty()
    joinInfo: LiveMemerInfoResponse;
    
}