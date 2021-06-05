import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SNS, ConfigurationOptions } from 'aws-sdk';
import { PublishResponse, PublishInput } from 'aws-sdk/clients/sns';
import { v4 as uuid } from 'uuid';


@Injectable()
export class SmsService {
    private readonly _sns: SNS;

    constructor( ){
        this._sns = new SNS({
            accessKeyId: process.env.AWS_SNS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SNS_SECRET,
            region: process.env.AWS_REGION,
            apiVersion: '2010-03-31'
        });
    }

    async sendSMS(smsOptions: PublishInput) {
        return this._sns
            .publish(smsOptions)
            .promise()
            .then((info: PublishResponse) => {
                Logger.log(` success[sendSms]: ${JSON.stringify(info)}`);
                return [
                    {
                        statusCode: HttpStatus.OK,
                        message: 'Sms sent',
                        data: info,
                    },
                ];
            })
            .catch((err) => {
                Logger.error('error[sendSms]:', err);
                throw new HttpException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Failed to send',
                    data: err,
                }, HttpStatus.BAD_REQUEST);
            });
    }

}
