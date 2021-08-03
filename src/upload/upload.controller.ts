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


@ApiTags('fileupload')
@ApiConsumes('multipart/form-data')
@Controller('fileupload')
export class ImageUploadController {
    constructor(private readonly imageUploadService: ImageUploadService) {}


    @Post()
    @ApiBody({
        type: UploadFileDto
    })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @UseGuards( JwtAuthGuard )
    @UseInterceptors(FileInterceptor('file'))
    async create( @UploadedFile() file, @Res() response ): Promise<object> {
        const fileUploaded = await this.imageUploadService.uploadImage(file.buffer, file.originalname);
        return response
            .status(201)
            .json({ fileUrl: fileUploaded });
    }


    
    @Post('video')
    @UseGuards( AdminJWTAuthGuard )
    @UseInterceptors(FileInterceptor('file'))
    async uploadVideo( @UploadedFile() file, @Res() response ): Promise<object> {
        const fileUploaded = await this.imageUploadService.uploadVideo(file.buffer, file.originalname);
        return response
            .status(201)
            .json({ fileUrl: fileUploaded });
    }

    @UseGuards( AdminJWTAuthGuard )
    @Get('startUpload')
    async startUpload(@Req() req, @Res() res ): Promise<object>{
        try {
            let params = {
                Bucket: AWS_S3_BUCKET_NAME,
                Key: req.query.fileName,
                ContentType: req.query.fileType
            }
       
            let uploadData = await s3.createMultipartUpload(params).promise();
            res.send({uploadId: uploadData.UploadId})
            
        } catch(err) {
         
        }
    }

    @UseGuards( AdminJWTAuthGuard )
    @Get('getUploadUrl')
    async getUploadUrl(@Req() req, @Res() res ): Promise<object>{
        try {
            let params = {
                Bucket: AWS_S3_BUCKET_NAME,
                Key: req.query.fileName,
                PartNumber: req.query.partNumber,
                UploadId: req.query.uploadId
            }

            let presignedUrl = await s3.getSignedUrlPromise('uploadPart', params);
            res.send({presignedUrl});

        } catch(err) {
            throw err
        }
    }

    @UseGuards( AdminJWTAuthGuard )
    @Post('completedUpload')

    async completedUpload(@Req() req, @Res() res ): Promise<object>{
        try {
         
            let params = {
                Bucket: AWS_S3_BUCKET_NAME,
                Key: req.body.fileName,
                MultipartUpload: {
                    Parts: req.body.parts
                },
                UploadId: req.body.uploadId
            }
       
            let data = await s3.completeMultipartUpload(params).promise();
            res.send({data})
        } catch(err) {
            throw err
        }
    }
}