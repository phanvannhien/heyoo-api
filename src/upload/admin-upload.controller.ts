import { Controller, Post, Req, Res, UseGuards, UseInterceptors, UploadedFile, Get } from '@nestjs/common';
import { ImageUploadService } from './upload.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiOkResponse, ApiTags, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import {Promise} from "bluebird";
import * as AWS from 'aws-sdk';
const AWS_S3_BUCKET_NAME = process.env.AWS_PUBLIC_BUCKET_NAME;
import { v4 as uuid } from 'uuid';
import { UploadFileDto } from './dto/upload.dto';
import { AdminJWTAuthGuard } from 'src/admin-users/admin-jwt-auth.guard';

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion: '2006-03-01',
    signatureVersion: 'v4',
});


@ApiTags('admin')
@ApiConsumes('multipart/form-data')
@Controller('admin-fileupload')
export class AdminUploadController {
    constructor(private readonly imageUploadService: ImageUploadService) {}

    @Post()
    @ApiBody({
        type: UploadFileDto
    })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @UseGuards( AdminJWTAuthGuard )
    @UseInterceptors(FileInterceptor('file'))
    async create( @UploadedFile() file, @Res() response ): Promise<object> {
        const fileUploaded = await this.imageUploadService.uploadFileS3(file.buffer, file.originalname);
        return response
            .status(201)
            .json({ fileUrl: fileUploaded });
    }

   
}