import { ApiProperty } from "@nestjs/swagger";
import { CategoriesResponse } from "src/categories/responses/categories.response";
import { UserResponse } from "src/users/responses/user.response";
import { LiveStreamItemResponse } from "./live-item.response";

export class LiveStreamResponse{
  
    constructor( object: any ){
        this.stream = new LiveStreamItemResponse(object.stream);
        this.agoraToken = object.agoraToken || '';
        this.agoraRtmToken = object.rtmToken || '';
    }
    @ApiProperty()
    stream: LiveStreamItemResponse;

    @ApiProperty()
    agoraToken: string;

    @ApiProperty()
    agoraRtmToken: string;
    
}