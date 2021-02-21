import { ApiProperty } from "@nestjs/swagger";
import { UserResponse } from "src/users/responses/user.response";

export class AuthResponse{
  
    constructor( object: any ){
        this.accessToken = object.accessToken;
        this.user = new UserResponse(object.user)
    }

    @ApiProperty()
    readonly accessToken: string;
    @ApiProperty()
    readonly user: UserResponse;

}