import { HttpModule, Module } from '@nestjs/common';
import { AdminChatController } from './admin-chat.controller';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';


@Module({
    imports: [
        HttpModule
    ],
    controllers: [ChatController, AdminChatController],
    providers: [ChatService],
    exports: [ChatService],
})
export class ChatModule {}