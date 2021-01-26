import { Controller, Get, UseGuards, Post, Request, Res, Body, 
  ValidationPipe, 
  UsePipes,
  ClassSerializerInterceptor, 
  UseInterceptors,
  SerializeOptions
} from '@nestjs/common';
import { AppService } from './app.service';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

}
