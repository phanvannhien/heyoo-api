import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const permissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!permissions) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const hasRole = () => user.permissions.some((per) => permissions.indexOf(per)> -1);
    var hasPermission = false;

    if(hasRole()){
      hasPermission = true;
      // if(req.params.email || req.body.email) {
      //   if(req.user.email != req.params.email && req.user.email != req.body.email){ 
      //     hasPermission = false;
      //   }
      // }
    }

    return user && user.permissions && hasPermission;
  }
}
