import { Controller, Get, Post, Body, Put, Param, Delete, BadRequestException, HttpCode, HttpStatus } from '@nestjs/common';
import { OtpsService } from './otps.service';
import { CreateOtpDto } from './dto/create-otp.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { randomOTP, sendOTPSMS } from 'src/common/utils/opt.utils';
import { OPT_MINUTES_EXPIRED } from 'src/app.constants';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { VerifyOtpDto } from './dto/verify-otp.dto'
import { OtpEntityDocument } from './entities/otp.entity';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { OtpSchema } from './schemas/otp.schema';
import { OtpResponse } from './responses/otp.response';
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_PHONE } from "src/app.constants";
const clientTwilio = require('twilio')( TWILIO_ACCOUNT_SID , TWILIO_AUTH_TOKEN);
import { SmsService } from './sms.service';
import { PublishInput } from 'aws-sdk/clients/sns';

@ApiTags('otps')
@Controller('otps')
export class OtpsController {
  constructor(
      private readonly otpsService: OtpsService,
      private readonly smsService: SmsService
    ) {}

  @ApiOkResponse({
    type: OtpResponse
  })
  @Post()
  @HttpCode( HttpStatus.OK )
  async create(@Body() createOptDto: CreateOtpDto): Promise<IResponse> {
    const OtpNumber = randomOTP();

    try{        
      // const message = await clientTwilio.messages
      //     .create({
      //         body: OtpNumber,
      //         from: TWILIO_FROM_PHONE,
      //         to: createOptDto.phone
      //     })
      // .then( message => message );

      const params: PublishInput = {
        PhoneNumber: createOptDto.phone,
        Message: OtpNumber.toString(),
        // Subject: 'Heyoo Otp'
      }
      const message =  await this.smsService.sendSMS(params);
          
      createOptDto.otpCode = String(OtpNumber);
      createOptDto.expriredAt = new Date( new Date().getTime() + OPT_MINUTES_EXPIRED *60000);
      createOptDto.nextRequestMinutes = 1;
      const otp = await this.otpsService.create(createOptDto);
      return new ResponseSuccess( new OtpResponse(otp) );
      
    }catch(error){
       throw new BadRequestException('Send OPT fail')
    }

  
  }

  @ApiOkResponse()
  @Post('verify')
  @HttpCode( HttpStatus.OK )
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto ) {
    const find = await this.otpsService.findByPhoneAndOtpCode(verifyOtpDto);
    if( !find ) throw new BadRequestException('otpCode not found')
    return new ResponseSuccess({ success: true })

  }

}
