import { Controller, Get, UseGuards, Post, Request, Res, Body, 
  ValidationPipe, 
  UsePipes,
  ClassSerializerInterceptor, 
  UseInterceptors,
  SerializeOptions
} from '@nestjs/common';
import { AppService } from './app.service';
import { countries, languages } from 'countries-list'
const crypto = require('crypto');

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('countries')
  getCountries(){
   
    let data = [];
    Object.keys(countries).forEach( o => {
      data[countries[o]] = {
        name: countries[o]['name'],
        phone: countries[o]['phone'],
      }
      // data.push()
    });
    return data;
  }

  @Get('v2/countries')
  getCountriesV2(){
    let data = [];
    Object.keys(countries).forEach( o => {
      data.push({
        name: countries[o]['name'],
        phone: countries[o]['phone'],
      })
    });
    return data;
  }

  @Get('languages')
  getLanguages(){
    return languages;
  }


  /**
   * 
   * @param requestBody 
   * {
      "oauth_token": "{user-access-token}",
      "algorithm": "HMAC-SHA256",
      "expires": 1291840400,
      "issued_at": 1291836800,
      "user_id": "218471"
    }
   */
  @Post('facebook/data-deletion')
  async facebokCallbackDataDeletion( @Body() requestBody ){
    const secret = process.env.FACEBOOK_APP_SECRET;
    var encoded_data = requestBody.signedRequest.split('.', 2);
    // decode the data
    var sig = encoded_data[0];
    var json = this.appService.base64decode(encoded_data[1]);
    var data = JSON.parse(json);
    if (!data.algorithm || data.algorithm.toUpperCase() != 'HMAC-SHA256') {
      throw Error('Unknown algorithm: ' + data.algorithm + '. Expected HMAC-SHA256');
    }

    var expected_sig = crypto.createHmac('sha256', secret)
      .update(encoded_data[1]).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace('=', '');
    
    if (sig !== expected_sig) {
      throw Error('Invalid signature: ' + sig + '. Expected ' + expected_sig);
    }
    const user_id = data['user_id'];

    // Start data deletion
    const status_url = 'https://www.<your_website>.com/deletion?id=abc123'; // URL to track the deletion
    const confirmation_code = 'abc123'; 
    
    const responseData = {
      url: process.env.APP_URL+ '/fbdeletion?id='+user_id ,
      confirmation_code:  crypto.randomBytes(20).toString('hex')
    }
    return responseData;
  }



  

}