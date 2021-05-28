import { Injectable, Get, Req, Res, Post } from "@nestjs/common";
import {Promise} from "bluebird";
import * as AWS from 'aws-sdk';

const AWS_S3_BUCKET_NAME = process.env.AWS_PUBLIC_BUCKET_NAME;
const s3 = new AWS.S3();

@Injectable()
export class UploadChunkService {

    
}