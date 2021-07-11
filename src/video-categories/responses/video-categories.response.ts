import { ApiProperty } from "@nestjs/swagger";

export class VideoCategoriesResponse{
    constructor( object: any ){
        this.id = object.id ??  object._id;
        this.categoryName = object.categoryName;
    }
    @ApiProperty()
    id: String;

    @ApiProperty()
    categoryName: String;
}