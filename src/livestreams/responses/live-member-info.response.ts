import { ApiProperty } from "@nestjs/swagger";

export class LiveMemerInfoResponse{
  
    constructor( object: any ){
        this.joinAt = object.joinAt
        this.leaveAt = object.leaveAt || null;
        this.uid = object.uid;
    }

    @ApiProperty()
    joinAt: Date;

    @ApiProperty()
    leaveAt: Date;

    @ApiProperty()
    uid: number;

    
}