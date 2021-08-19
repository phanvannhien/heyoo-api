import { Req, Res, Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { v4 as uuid } from 'uuid';
const fs = require('fs');

const AWS_S3_BUCKET_NAME = process.env.AWS_PUBLIC_BUCKET_NAME;
const s3 = new AWS.S3();
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

@Injectable()
export class ImageUploadService {
    constructor() {}

    async fileupload(@Req() req, @Res() res) {
        try {
            this.upload(req, res, function(error) {
                if (error) {
                    return res.status(404).json(`Failed to upload image file: ${error}`);
                }
            
                return res.status(201).json({
                    fileUrl: `${process.env.CLOUD_FRONT_VIDEO_URL}/${req.files[0].key}`
                });
            });
        } catch (error) {
            return res.status(500).json(`Failed to upload image file: ${error}`);
        }
    }

    upload = multer({
        storage: multerS3({
            s3: s3,
            bucket: AWS_S3_BUCKET_NAME,
            acl: 'public-read',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: function(request, file, cb) {
                cb(null, `${Date.now().toString()}-${uuid()}`);
            },
        }),
    }).array('file', 1);

    async uploadVideo(dataBuffer: Buffer, filename: string): Promise<string> {
        const s3 = new AWS.S3({ 
            httpOptions: { timeout: 10 * 60 * 1000 }
        });
        var options = { partSize: 5 * 1024 * 1024, queueSize: 10 };  

        const uploadResult = await s3.upload({
            Bucket: AWS_S3_BUCKET_NAME,
            Body: dataBuffer,
            Key: `${uuid()}`,
            ContentType: "video/mp4"
        }, options).promise();

        return `${process.env.CLOUD_FRONT_VIDEO_URL}/${uploadResult.Key}`
    }


    async uploadImage(dataBuffer: Buffer, filename: string): Promise<string> {
        const s3 = new AWS.S3({ 
            httpOptions: { timeout: 20 * 60 * 1000 }
        });
       
        const uploadResult = await s3.upload({
            Bucket: AWS_S3_BUCKET_NAME,
            Body: dataBuffer,
            Key: `${uuid()}`,
            ContentType: "image/jpg"
        }).promise();

        return `${process.env.CLOUD_FRONT_VIDEO_URL}/${uploadResult.Key}`
    }

    async uploadFileS3(dataBuffer: Buffer, filename: string): Promise<string> {
        const s3 = new AWS.S3();
        
        const uploadResult = await s3.upload({
            Bucket: AWS_S3_BUCKET_NAME,
            Body: dataBuffer,
            Key: `${uuid()}-${filename}`
        }) .promise();
     
        return `${process.env.CLOUD_FRONT_VIDEO_URL}/${uploadResult.Key}`;

        
    }
}