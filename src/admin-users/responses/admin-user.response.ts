import { ApiProperty } from "@nestjs/swagger";

export class AdminUserResponse{
  
    constructor( object: any ){
        this._id        = object._id;
        this.id         = object.id;
        this.fullname   = object.fullname;
        this.email   = object.email;
        this.activated = object.activated;
        this.language = object.language;
        this.createdAt = object.createdAt;
        this.role = object.role;
        this.introduction = 'heyoo';
        this.permissions =  object.perrmissions ;
    }
    @ApiProperty()
    readonly _id: string;

    @ApiProperty()
    readonly id: string;

    @ApiProperty()
    readonly fullname: string;

    @ApiProperty()
    readonly email: string;

    @ApiProperty()
    readonly activated: boolean;

    @ApiProperty()
    readonly language: string;

    @ApiProperty()
    readonly createdAt: boolean;

    @ApiProperty()
    readonly role: string;

    @ApiProperty()
    readonly introduction: string;

    @ApiProperty()
    readonly permissions: string[];

}