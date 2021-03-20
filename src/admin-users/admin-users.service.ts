import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { AdminUser } from './entities/admin-user.entity';

@Injectable()
export class AdminUsersService {
  constructor(@InjectModel('AdminUser') private readonly adminUserModel: Model<AdminUser>){

  }

  async findByEmail(email: string): Promise<AdminUser>{
    return await this.adminUserModel.findOne({ email: email }).exec();
  }

  async create(createAdminUserDto: CreateAdminUserDto): Promise<AdminUser>{
    const adminUser = new this.adminUserModel(createAdminUserDto);
    return await adminUser.save();
  }

  async findAll(): Promise<any> {
    return await this.adminUserModel.find().exec();
  }

  async findById(id: string): Promise<any> {
    return await this.adminUserModel.findById( id ).exec();
  }

  async findOneByEmail(email: string): Promise<any> {
    return await this.adminUserModel.findOne({ email:email}).exec();
  }

  update(id: number, updateAdminUserDto: UpdateAdminUserDto) {
    return `This action updates a #${id} adminUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} adminUser`;
  }
}
