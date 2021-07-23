import { ApiProperty } from "@nestjs/swagger";
import { AdminUser } from "../entities/admin-user.entity";
import { AdminUserResponse } from "./admin-user.response";

export class AdminUserPaginateResponse{
  
    constructor( object: AdminUser[] ){
        this.items = object.map( i => new AdminUserResponse(i) );
        this.total = object.length;

    }
    @ApiProperty()
    readonly items: AdminUserResponse[] ;

    @ApiProperty()
    readonly total: number;

}