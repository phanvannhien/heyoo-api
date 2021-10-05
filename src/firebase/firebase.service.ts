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
    
    sendTopicMessage( body: string, chatRoomId: string, icon: string, uid: string ){

        const payload: messaging.MessagingPayload = {
            data: {
                sender: uid,
                id: chatRoomId,
                status: 'done',
                clickAction: 'FLUTTER_NOTIFICATION_CLICK'
            },
            notification: {
                title: 'Heyoo',
                body: body,
                icon: icon ?? 'https://d21y6rmzuyq1qt.cloudfront.net/27a2ff52-6ae1-49e3-bde6-6427b661588f',
                clickAction: 'FLUTTER_NOTIFICATION_CLICK',
            }
        }

        admin.messaging().sendToTopic( chatRoomId, payload  )
    }

    sendMessage( deviceTokens: string[], messageData: INotifyMessageBody ){

        const dataString = {};
        
        Object.keys(messageData.metaData).forEach(key => {
            dataString[key] = messageData.metaData[key].toString();
        })

        const metaData = {
            title: messageData.title,
            body: messageData.body,
            imageUrl: messageData.imageUrl ?? 'https://d21y6rmzuyq1qt.cloudfront.net/27a2ff52-6ae1-49e3-bde6-6427b661588f',
            clickAction: messageData.clickAction,
            ...dataString
        }

        const message: messaging.MulticastMessage = {
            data: metaData,
            tokens: deviceTokens,
            // notification: {
            //     title: messageData.title,
            //     body: messageData.body
            // },
            // android: {
            //     notification: {
            //         imageUrl: messageData.imageUrl,
            //         clickAction: messageData.clickAction
            //     }
            // },
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
            .then( response => { 
                console.log('Notify Send status');
                console.log(response);
            })
            .catch( err => { console.log(err) } );
               
    }
}