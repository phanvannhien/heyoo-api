import { Injectable } from '@nestjs/common';
const {RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole} = require('agora-access-token')
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AgoraService {
    constructor(
        private readonly configService: ConfigService
    ) {}

    async generateAgoraToken(channelName: string, uid : number ): Promise<string>{
        // Rtc Examples
        const appID = this.configService.get('AGORA_APP_ID');
        const appCertificate = this.configService.get('AGORA_CERTIFICATE');
        const role = RtcRole.PUBLISHER;
        const expirationTimeInSeconds = 3600*24*7;
        const currentTimestamp = Math.floor(Date.now() / 1000)
        const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
        // Build token with user account
        // const token = RtcTokenBuilder.buildTokenWithAccount(appID, appCertificate, channelName, accountId, role, privilegeExpiredTs);
        // Build token with uid
        return RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid , role, privilegeExpiredTs);
       
    }

    async generateAgoraRtmToken( uid : string, rtmRule ): Promise<string>{
        // Rtc Examples
        const appID = this.configService.get('AGORA_APP_ID');
        const appCertificate = this.configService.get('AGORA_CERTIFICATE');
        const expirationTimeInSeconds = 3600*24*7;
        const currentTimestamp = Math.floor(Date.now() / 1000)
        const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
     
        return RtmTokenBuilder.buildToken( appID, appCertificate, uid , rtmRule, privilegeExpiredTs );
        

       
    }


    
}
