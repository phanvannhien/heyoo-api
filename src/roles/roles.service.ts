import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntityDocument } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(@InjectModel('RoleModel') private readonly roleModel: Model<RoleEntityDocument>){

  }
  
  async create(createRoleDto: CreateRoleDto): Promise<RoleEntityDocument> {
    const role = new this.roleModel( createRoleDto );
    return await role.save();
  }

  async findAll(): Promise<RoleEntityDocument[]> {
    return await this.roleModel.find({});
  }

  async findById(id: string): Promise<RoleEntityDocument>  {
    return await this.roleModel.findById( id );
  }

  async findByRoleName( roleName : string): Promise<RoleEntityDocument>  {
    return await this.roleModel.findOne({
      roleName: roleName
    }).exec();
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<RoleEntityDocument>   {
    return await this.roleModel.findByIdAndUpdate( id, updateRoleDto );
  }

  async remove(id: string): Promise<RoleEntityDocument>  {
    return await this.roleModel.findByIdAndDelete(id);
  }
}
