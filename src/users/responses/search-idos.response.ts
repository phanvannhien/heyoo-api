import { ApiProperty } from "@nestjs/swagger";
import { UserProfileResponse } from "src/auth/responses/profile.response";
import { SearchIdoResponse } from "./search-ido.response";

export class SearchIdosResponse{
    constructor( object: any ){

        this.total = object.total.length > 0 ? object.total[0].count : 0;
        this.items = object.items.length > 0 ? object.items.map( i => new UserProfileResponse(i) ): [];

    }
   
    @ApiProperty()
    items: UserProfileResponse[];

    @ApiProperty()
    total: number;
}