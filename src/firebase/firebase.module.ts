import { Global, HttpModule, Module } from '@nestjs/common';
import { FirebaseDBService } from './firebase-db.service';
import { FirebaseUserService } from './firebase-user.service';
import { FirebaseCloudMessageService } from './firebase.service';

@Global()
@Module({
    imports: [
        HttpModule
    ],
    controllers: [],
    providers: [
        FirebaseCloudMessageService,
        FirebaseUserService,
        FirebaseDBService
    ],
    exports: [
        FirebaseCloudMessageService,
        FirebaseUserService,
        FirebaseDBService
    ],
})
export class FirebaseCloudMessageModule {}