import { ApiProperty } from "@nestjs/swagger";
import moment = require("moment");

export class NotificationItemResponse{
  
    constructor( object: any ){
        this.id = object.id ?? object._id;
        this.title = object.title;
        this.body = object.body;
        this.imageUrl = object.imageUrl;
        this.metaData = object.metaData;
        this.clickAction = object.clickAction;
        this.isRead = object.isRead;
        this.createdAt = moment(object.createdAt).valueOf().toString();
    }
    @ApiProperty()
    id: string;
    
    @ApiProperty()
    title: string; 
    
    @ApiProperty()
    body: string; 

    @ApiProperty()
    imageUrl: string;

    @ApiProperty()
    metaData: object;

    @ApiProperty()
    clickAction: string;

    @ApiProperty() 
    isRead: boolean; 
  
    @ApiProperty()
    createdAt: string;
}