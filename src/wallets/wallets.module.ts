import { Module } from '@nestjs/common';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';
import { WalletSchema } from './schemas/wallet.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: 'Wallet', schema: WalletSchema }
    ]),
    ProductsModule,
    UsersModule
],
  controllers: [WalletsController],
  providers: [WalletsService],
  exports:[
    WalletsService
  ]
})
export class WalletsModule {}
