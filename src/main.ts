import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { MONGO_URI, PORT } from './app.constants'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import * as mongoose from 'mongoose';

import * as admin from 'firebase-admin';
import { ServiceAccount } from "firebase-admin";

const privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDVK9V+gnEZWQ3i\nyOzl2rTx/gyVB6JX6fLMllihyWfVJEI0rwA3Gzo5e5sqTJcbOvOS7d6XlOe8GL6K\nxKXnnlFWOhyMWUDUJYfYMlkUP53zk7gL9VM4+nyjpC/baaSX5SXyDCrUdQ8Q0mSP\n39lzw5KX23HGXGuuAOIrk+/Wb3Jyhdx7e1rpqa0zFtLuuo8zwoQqB9OHuuatsG3U\n8mlEA9+LsJMuw+ZnY7+2BkHUqktMej83f3WEDCsYPWX6xgwci8LF6DRA0k8hWu4k\nYLfGuU55yFL7K5XYvPuvR7bnzx+WXXyiilUMB9VnI167vqHjN8OQbrQpgRg2/yxi\nzCKVBnu9AgMBAAECggEAL1BFWIj3NVsQu+9AtVuvoa5zeHhzTfP9Ee+kyHP9ec9M\naokVESYX7D5FGERbnY2eFlR5fUdtj9AmKoKvGBOJlgvb3kLJIs0Zs6CpKNdd5Xw5\n812GFTVziJaekKKIB7ayj2Cn+PPqXh90doKGry0PUmlAfXhx5fMIQAfbycp+qnAn\nxZ3Q9rgWcDSiXrQbaeBK57cxeZ7JFS7Mxhxjxn4VC1FU/EjEdhbGu8MtzSmwPFc9\nxNaMMwfzZvSz0s5W7tCiKt0mVqaUWWI0d27BI2bhrxoM53tLzFnSKwsAlChbDSRw\nbGvsUAj8S5E3RGIwd8lXkQejlD6/UvHB817mBtBZeQKBgQD1iiyDLxUqlAcrk89T\nkkyy0ehubhgGt0LNt7yriXDXbtw5+oUCjCODgFHzYA+XCSm1sDiCeX85RT08nECK\nGm8Dqx7FoMmdy7bCJq3965CDF53XMxzDgWXgu3/tXfXhe5tztdX4UYDrV3MAeZqy\neY5R3M+PfdZj0/vamXoesb2rCwKBgQDeQKcuYOkbhOzC/23aaYjhtiL21/NuqJsj\nWpxz79Ubloo29mfrKabcLaU2wsEd0sIoGNpy4+ZXdkkUXUBh2f5RSylu1v+GAW+x\neIUiN6lAI0VFBUPO7uCVCpGNgRpWwJ+DOZKF+3IbJ1nez50J8/X6OxSFJvZIpicr\n0ocI9iTxVwKBgAFIBU9x8XRVbWwmy1AuVUQhoErjPDDcx/Z23P8wKmyVYYTT79nB\njXXkN4lDmRE6tQMDtmfH5ogP+m/UiOmvlaC5ReHWIvc11vBQb1wB3LEycFptI9tJ\nU5TGpbZBZUUV9gu2iTVQh5Gy1SDNgacoxztaIaMoDvRaaNgNMPv0BX9dAoGBAIrt\nExPUlCIVlwHVNM/gRCYC+hwepRY44rDYxQ9bjXSvRzpQEGlZIepjxfBTEPAZfDAg\nSPykJKnrUIcgO0xvPZ+HQiD818DmSPFAisf2zx8+bOBWCCrj+xJvBsjTOKmdwpf+\ndu61XIBIus6iLGG6U7nVEGCjGDQVWEr2UF5zrmgFAoGBAKPJjdfxaZidPf1AI4KM\nWOS/wrXXcaVE8Xruq+CSrg9fh65ce6EyaE/wCjtJilVIRd/WXA+mtzLelLUg/ezT\n09v+9KhJMtTl+aZJa7/I/z6Cz61ImxCLmYKt9L3IPw06RV+6SpTWrksiSJJQ+lFm\njOMsBSthw9NBMeiiYUDvuBW2\n-----END PRIVATE KEY-----\n"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const configSwagger = new DocumentBuilder()
    .setTitle('Heyoo API')
    .setDescription('The Heyoo API description')
    .setVersion('1.0')
    .addTag('heyoo')
    .addBearerAuth()
    .build();

  config.update({
      accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
      region: configService.get('AWS_REGION'),
  });

  const adminConfig: ServiceAccount = {
    "projectId": process.env.FIREBASE_PROJECT_ID,
    "privateKey": privateKey.replace(/\\n/g, '\n'),
    "clientEmail": process.env.FIREBASE_CLIENT_EMAIL,
  };

  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    databaseURL: process.env.FIREBASE_DB_URL
  });

  app.enableCors();
  const documentSwagger = SwaggerModule.createDocument(app, configSwagger);

  SwaggerModule.setup('api', app, documentSwagger);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.listen( PORT , () => {
    console.log("Application is running at port:" + PORT );
    // mongoose.set('debug', true);
  });
}

bootstrap();