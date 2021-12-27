import { Injectable } from "@nestjs/common";
import * as admin from 'firebase-admin';
import { ShopEntityDocument } from "src/shop/entities/shop.entity";
import { User } from "src/users/interfaces/user.interface";

@Injectable()
export class FirebaseDBService {

    saveShop( shop: ShopEntityDocument ){
        const db = admin.database();
        const ref = db.ref('live');
        const usersRef = ref.child('users');
        const childId = shop.id || shop._id;

        const updateShopFirebase = {
            email: shop.email,
            phoneNumber: shop.phone ,
            name: shop.shopName,
            gender: 0,
            avatar: shop.image,
            bio: shop.description,
            shopAdmins: shop.user.toString()
        };
        usersRef.child( childId.toString() ).set(updateShopFirebase);
    }

    saveUser( user: User ){
        const db = admin.database();
        const ref = db.ref('live');
        const usersRef = ref.child('users');
        const childId = user.id || user._id;
        const updateUserFirebase = {
            email: user.email,
            phoneNumber: user.phone ,
            name: user.fullname,
            gender: user.gender,
            avatar: '',
            bio: user.bio ?? 'heyoo',
        };
        usersRef.child( childId.toString() ).set(updateUserFirebase);
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