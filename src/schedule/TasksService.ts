import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LivestreamsService } from 'src/livestreams/livestreams.service';
import * as AWS from 'aws-sdk';

const AWS_S3_BUCKET_NAME = process.env.AWS_PUBLIC_BUCKET_NAME;
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    constructor(
        private readonly livestreamsService: LivestreamsService,
    ){
        
    }

    @Cron( CronExpression.EVERY_10_MINUTES )
    async handleCron() {
        const allLive = await this.livestreamsService.findAllShopLiveStreamAfter7Days();
        
        allLive.forEach( live => {
            const listParams = {
                Bucket: AWS_S3_BUCKET_NAME,
                Prefix: `videos/${live.shop}/${live.streamerUid}/`
            };
            const s3 = new AWS.S3();
            s3.listObjects( listParams, (err, data) => {
                if (err) return err;
           
                if (data.Contents.length == 0) return;

                const deleteParams = {
                    Bucket: AWS_S3_BUCKET_NAME,
                    Delete: { Objects: [] }
                };
                
                data.Contents.forEach(function(content) {
                    deleteParams.Delete.Objects.push({Key: content.Key});
                });
            
                s3.deleteObjects( deleteParams, (err, data) => {
                    if (err) return err;
                    this.logger.debug('Deleted');
                    this.logger.debug( deleteParams );
                });
            })
        });
        
        
    }

    
}