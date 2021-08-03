
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from 'src/auth/constants';
import { AdminUsersService } from './admin-users.service';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy,'admin') {
    constructor(
        private adminUserService: AdminUsersService,
        private roleService: RolesService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.adminSecret,
        });
    }

    async validate(payload: any) {
        const user = await this.adminUserService.findById( payload.id );
        const role = await this.roleService.findByRoleName(user.role);
        
        return {
            ...user.toObject(),
            id: user.id,
            permissions: role.permissions
        };
    }
}