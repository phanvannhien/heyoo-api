import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminJWTAuthGuard } from 'src/admin-users/admin-jwt-auth.guard';
import { ChatService } from './chat.service';

@ApiTags('admin')
@Controller('admin-chat')
export class AdminChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('sync-sendbird-user')
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  async syncUserToSendBird(): Promise<any> {
    return await this.chatService.syncUserSendBirdUser();
  }

}
