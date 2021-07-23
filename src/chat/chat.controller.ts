import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('sync-sendbird-user')
  async syncUserToSendBird(): Promise<any> {
    return await this.chatService.syncUserSendBirdUser();
  }

}
