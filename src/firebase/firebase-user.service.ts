import { Injectable } from "@nestjs/common";
import * as admin from 'firebase-admin';
import { User } from "src/users/interfaces/user.interface";

@Injectable()
export class FirebaseUserService {

    findOneUser( user: User ): Promise<any>{
        return admin
            .auth()
            .getUser(user.id)
            .then((userRecord) => {
                return userRecord
            })
            .catch((error) => { 
                return null
             });
    }

    createUser( user: User ): Promise<any>{
        return admin
            .auth()
            .createUser({
                uid: user.id ,
                email: user.email,
                phoneNumber: user.phone ,
                displayName: user.fullname,
                photoURL: user.avatar
            })
            .then((userRecord) => {
                return userRecord
            })
            .catch((error) => {
                return null
            });
    }
    
}