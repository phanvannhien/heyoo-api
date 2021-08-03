import { Global, Module } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { ConfigurationController } from './configuration.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CONFIGURATION_MODEL } from 'src/mongo-model.constance';
import { ConfigurationSchema } from './schemas/configuration.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CONFIGURATION_MODEL , schema: ConfigurationSchema },
    ]),
  ],
  controllers: [ConfigurationController],
  providers: [ConfigurationService],
  exports:[
    ConfigurationService
  ]
})
export class ConfigurationModule {}
