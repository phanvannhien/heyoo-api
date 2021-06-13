import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {

  constructor(
    private readonly configService: ConfigService
  ) {}
  
  getHello(): string {
    return 'Hello World!';
  }

  // decode data facebook
  base64decode(data) {
    while (data.length % 4 !== 0){
      data += '=';
    }
    data = data.replace(/-/g, '+').replace(/_/g, '/');
    return new Buffer(data, 'base64').toString('utf-8');
  }

}