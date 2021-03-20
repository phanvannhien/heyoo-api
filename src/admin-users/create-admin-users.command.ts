import { Command, Positional, Option } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';


@Injectable()
export class CreateAdminUserCommand {
    constructor(private readonly adminUserService: AdminUsersService) {}

    @Command({
        command: 'create:admin-user <email> <password>',
        describe: 'create a user admin',
        autoExit: true
    })
    async create(
        @Positional({
            name: 'email',
            describe: 'the email admin',
            alias: 'e',
            type: 'string'
        })
        email: string,

        @Positional({
            name: 'password',
            describe: 'the password',
            type: 'string',
            alias: 'p'
        })
        password: string,
        
    ) {
        console.log('Starting...')
        const data  = new CreateAdminUserDto();
        data.email = email;
        data.password = password;
        const user = await this.adminUserService.create(data);
        console.log('Created admin user success:' + user._id)
    }
}