import { Controller, Post, Req, Res, UseGuards, UseInterceptors, UploadedFile, Get } from '@nestjs/common';
import { ImageUploadService } from './upload.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiOkResponse, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import {Promise} from "bluebird";
import * as AWS from 'aws-sdk';
const AWS_S3_BUCKET_NAME = process.env.AWS_PUBLIC_BUCKET_NAME;
import { v4 as uuid } from 'uuid';

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion: '2006-03-01',
    signatureVersion: 'v4',
});


@ApiTags('fileupload')
@Controller('fileupload')
export class ImageUploadController {
    constructor(private readonly imageUploadService: ImageUploadService) {}

    @Post()
    @UseGuards( JwtAuthGuard )
    async create(@Req() request, @Res() response) {
        try {
            await this.imageUploadService.fileupload(request, response);
        } catch (error) {
            return response
                .status(500)
                .json(`Failed to upload image file: ${error.message}`);
        }
    }

    @ApiConsumes('multipart/form-data')
    @Post('video')
    @UseInterceptors(FileInterceptor('file'))
    async uploadVideo( @UploadedFile() file, @Res() response ): Promise<object> {
        const fileUploaded = await this.imageUploadService.uploadVideo(file.buffer, file.originalname);
        return response
            .status(201)
            .json({ fileUrl: fileUploaded });
    }

    @UseGuards( JwtAuthGuard )
    @Get('startUpload')
    async startUpload(@Req() req, @Res() res ): Promise<object>{
        try {
            let params = {
                Bucket: AWS_S3_BUCKET_NAME,
                Key: req.query.fileName,
                ContentType: req.query.fileType
            }
            console.log(params);
            let uploadData = await s3.createMultipartUpload(params).promise();
            res.send({uploadId: uploadData.UploadId})
            
        } catch(err) {
            console.log(err)
        }
    }

    @UseGuards( JwtAuthGuard )
    @Get('getUploadUrl')
    async getUploadUrl(@Req() req, @Res() res ): Promise<object>{
        try {
            let params = {
                Bucket: AWS_S3_BUCKET_NAME,
                Key: req.query.fileName,
                PartNumber: req.query.partNumber,
                UploadId: req.query.uploadId
            }
            console.log(params);
            let presignedUrl = await s3.getSignedUrlPromise('uploadPart', params);
            res.send({presignedUrl});

        } catch(err) {
            console.log(err)
        }
    }

    @UseGuards( JwtAuthGuard )
    @Post('completedUpload')
    async completedUpload(@Req() req, @Res() res ): Promise<object>{
        try {
            console.log(req.body, ': body')
            let params = {
                Bucket: AWS_S3_BUCKET_NAME,
                Key: req.body.fileName,
                MultipartUpload: {
                    Parts: req.body.parts
                },
                UploadId: req.body.uploadId
            }
            console.log(params)
            let data = await s3.completeMultipartUpload(params).promise();
            res.send({data})
        } catch(err) {
            console.log(err)
        }
    }
}