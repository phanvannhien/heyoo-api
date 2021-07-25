import { ApiProperty } from "@nestjs/swagger";

export class LevelItemResponse{
  
    constructor( object: any ){
        this.id = object.id ?? object._id;
        this.levelImage = object.levelImage;
        this.levelName = object.levelName;
        this.minTarget = object.minTarget;
    }
    @ApiProperty()
    id: string;

    @ApiProperty()
    levelImage: string;

    @ApiProperty()
    levelName: string;

    @ApiProperty()
    minTarget: number;
}
