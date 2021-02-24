import { Injectable } from '@nestjs/common';
const {RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole} = require('agora-access-token')
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AgoraService {
    constructor(
        private readonly configService: ConfigService
    ) {}

    async generateAgoraToken(channelName: string, accountId: string ): Promise<string>{
        // Rtc Examples
        const appID = this.configService.get('AGORA_APP_ID');
        const appCertificate = this.configService.get('AGORA_CERTIFICATE');
        const role = RtcRole.PUBLISHER;
        const expirationTimeInSeconds = 3600
        const currentTimestamp = Math.floor(Date.now() / 1000)
        const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
        // Build token with user account
        const token = RtcTokenBuilder.buildTokenWithAccount(appID, appCertificate, channelName, accountId, role, privilegeExpiredTs);
        return token;
    }

    
}
