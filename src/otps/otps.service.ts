import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOtpDto } from './dto/create-otp.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { OtpEntityDocument } from './entities/otp.entity';
import { VerifyOtpDto } from './dto/verify-otp.dto'

@Injectable()
export class OtpsService {
  constructor(@InjectModel('Otps') private readonly otpModel: Model<OtpEntityDocument>){

  }

  async create(createOptDto: CreateOtpDto): Promise<OtpEntityDocument> {
    const i = new this.otpModel( createOptDto );
    return await i.save();
  }

  async findByPhoneAndOtpCode( verifyOtpDto: VerifyOtpDto ): Promise<OtpEntityDocument>{
    return await this.otpModel.findOne({
      phone: verifyOtpDto.phone,
      otpCode: verifyOtpDto.otpCode,
      expriredAt: { $gte: new Date() }
    }).exec()
  }

  async findOne(id: number): Promise<OtpEntityDocument> {
    return await this.otpModel.findById(id);
  }

  async update(id: number, updateOptDto: UpdateOtpDto): Promise<OtpEntityDocument> {
      return await this.otpModel.findByIdAndUpdate( id,  );
  }

  async remove(id: number): Promise<any> {
    return await this.otpModel.findByIdAndRemove(id);
  }
}
