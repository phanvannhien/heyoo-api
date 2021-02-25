import { ApiProperty } from "@nestjs/swagger";
import { CategoriesResponse } from "src/categories/responses/categories.response";
import { UserResponse } from "src/users/responses/user.response";
import { LiveStreamItemResponse } from "./live-item.response";
import { LiveMemerInfoResponse } from "./live-member-info.response";

export class LiveMemerResponse{
  
    constructor( object: any ){
        this.stream = new LiveStreamItemResponse(object.stream);
        this.agoraToken = object.agoraToken || '';
        this.joinInfo = new LiveMemerInfoResponse(object.joinInfo)
    }

    @ApiProperty()
    stream: LiveStreamItemResponse;

    @ApiProperty()
    agoraToken: string;

    @ApiProperty()
    joinInfo: LiveMemerInfoResponse;
    
}