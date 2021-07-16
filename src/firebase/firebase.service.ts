import { Injectable } from "@nestjs/common";
import * as admin from 'firebase-admin';
import { messaging } from "firebase-admin";

export interface INotifyMessageBody{
    title: string;
    body: string;
    imageUrl: string;
    metaData: {};
    clickAction: string;
}

@Injectable()
export class FirebaseCloudMessageService {
    constructor(
    ){}
    
    sendMessage( deviceTokens: string[], messageData: INotifyMessageBody ){

        const message: messaging.MulticastMessage = {
            data: messageData.metaData,
            tokens: deviceTokens,
            notification: {
                title: messageData.title,
                body: messageData.body
            },
            android: {
                notification: {
                    imageUrl: messageData.imageUrl,
                    clickAction: messageData.clickAction
                }
            },
            apns: {
                payload: {
                    aps: {
                        'mutable-content': 1,
                        category: messageData.clickAction
                    }
                },
                fcmOptions: {
                    imageUrl: messageData.imageUrl
                }
            }
        };

        admin.messaging().sendMulticast(message)
            .then( response => { console.log('Send Successfully') })
            .catch( err => { console.log(err) } );
               
    }


}