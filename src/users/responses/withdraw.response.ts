import { ApiProperty } from "@nestjs/swagger";
import { UserResponse } from "src/users/responses/user.response";

export class WithDrawItemResponse{
    constructor( object: any ){
        this.id = object.id ?? object._id;
        this.status = object.status;
        this.info = object.info;
        this.quantity = object.quantity ?? 0 ;
        this.user = new UserResponse(object.user);
        this.createdAt = object.createdAt;
    }
    @ApiProperty()
    id: string;

    @ApiProperty()
    status: string;

    @ApiProperty()
    quantity: number;

    @ApiProperty()
    price: number;

    @ApiProperty()
    info: string;

    @ApiProperty()
    user: UserResponse;

    @ApiProperty()
    createdAt: Boolean;
}