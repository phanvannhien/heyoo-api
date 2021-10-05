import { Injectable } from "@nestjs/common";
import * as admin from 'firebase-admin';
import { User } from "src/users/interfaces/user.interface";

@Injectable()
export class FirebaseDBService {

    saveUser( user: User ){
        const db = admin.database();
        const ref = db.ref('live');
        const usersRef = ref.child('users');
        usersRef.child( user.id ).set({
            email: user.email,
            phoneNumber: user.phone ,
            name: user.fullname,
            gender: user.gender,
            avatar: user.avatar ?? '',
            bio: user.bio ?? '',
        });
    }
    
    getMemberIdsInChatRoom( chatRoomId: string ): Promise<any>{
        const db = admin.database();
        const ref = db.ref(`live/chatrooms/${chatRoomId}/users`);

        return new Promise( ( resoved, reject ) => {
            ref.on('value', (snapshot) => {
                resoved(Object.keys( snapshot.val() ))
                
            }, (errorObject) => {
                reject(errorObject.name)
            }); 
        })

    }

}