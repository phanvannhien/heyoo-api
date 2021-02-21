export class CreateAdminUserDto {
    constructor( object: any ){
        this.email = object.email;
        this.password = object.password;
    }
    email: string;
    password: string;
}
