import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_PHONE } from "src/app.constants";
const clientTwilio = require('twilio')( TWILIO_ACCOUNT_SID , TWILIO_AUTH_TOKEN);

export function randomOTP(){
    return Math.floor(1000 + Math.random() * 9000)
}

export async function sendOTPSMS( phone: string, optCode: number ){
    try{        
        return await clientTwilio.messages
            .create({
                body: optCode,
                from: TWILIO_FROM_PHONE,
                to: phone
            })
        .then( message => message )
    }catch(error){
        return false;
    }
}