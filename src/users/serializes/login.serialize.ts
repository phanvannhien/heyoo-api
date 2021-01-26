import { Exclude } from "class-transformer";
import { UserEntity } from "./user.serialize";

export class LoginResponse{
    token: string;
    user: UserEntity;
    constructor(partial: Partial<LoginResponse>) {
        Object.assign(this, partial);
    }
}