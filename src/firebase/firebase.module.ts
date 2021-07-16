import { Global, HttpModule, Module } from '@nestjs/common';
import { FirebaseCloudMessageService } from './firebase.service';

@Global()
@Module({
    imports: [
        HttpModule
    ],
    controllers: [],
    providers: [
        FirebaseCloudMessageService
    ],
    exports: [
        FirebaseCloudMessageService
    ],
})
export class FirebaseCloudMessageModule {}