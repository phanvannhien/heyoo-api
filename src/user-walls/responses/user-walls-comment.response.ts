import { ApiProperty } from "@nestjs/swagger";
import { UserResponse } from "src/users/responses/user.response";
import * as moment from 'moment';
import { UserWallsItemResponse } from "src/user-walls/responses/userwalls.response";

export class UserWallCommentsItemResponse{
  
    constructor( object: any  ){
        this.id = object.id ?? object._id;
        this.comment = object.comment;
        this.createdAt = moment(object.createdAt).valueOf().toString();
        this.user = new UserResponse (object.user);
        this.wall = new UserWallsItemResponse(object.wall);
    }
    @ApiProperty()
    id: string;

    @ApiProperty()
    comment: string;

    @ApiProperty()
    wall: UserWallsItemResponse;

    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    user: UserResponse;
}
