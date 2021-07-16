import { ApiProperty } from "@nestjs/swagger";
import { NotificationItemResponse } from "./notification.response";

export class NotificationPaginateResponse{
  
    constructor( object: any ){
        this.total = object.total.length > 0 ? object.total[0].count : 0;
        this.items = object.items.length > 0 ? object.items.map( i => new NotificationItemResponse(i) ): [];
    }
   
    @ApiProperty()
    items: NotificationItemResponse[];

    @ApiProperty()
    total: number;
}