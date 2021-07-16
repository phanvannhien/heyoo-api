import { HttpModule, Module } from '@nestjs/common';
import { ChatService } from './chat.service';


@Module({
    imports: [
        HttpModule
    ],
    controllers: [],
    providers: [ChatService],
    exports: [ChatService],
})
export class ChatModule {}