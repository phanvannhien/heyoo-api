import { ApiProperty } from "@nestjs/swagger";
import { CategoriesResponse } from "src/categories/responses/categories.response";
import { UserResponse } from "src/users/responses/user.response";

export class LiveStreamResponse{
  
    constructor( object: any ){
        this.id = object.id;
        this.channelName = object.channelName;
        this.coverPicture = object.coverPicture;
        this.startLiveAt = object.startLiveAt;
        this.endLiveAt = object.endLiveAt;
        this.categories = object.categories.map( i => new CategoriesResponse(i) ) ;
        this.members = object.members;
        this.streamer = new UserResponse(object.streamer);
    }
    @ApiProperty()
    id: String;

    @ApiProperty()
    channelName: String;

    @ApiProperty()
    categories: Array<object>;

    @ApiProperty()
    coverPicture: String;

    @ApiProperty()
    startLiveAt: Date;

    @ApiProperty()
    endLiveAt: Date;

    @ApiProperty()
    members: Array<object>;

    @ApiProperty()
    streamer: object;
}