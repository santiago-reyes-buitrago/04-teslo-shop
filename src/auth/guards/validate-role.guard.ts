import {CanActivate, ExecutionContext, ForbiddenException, Injectable} from '@nestjs/common';
import {Observable} from 'rxjs';
import {Reflector} from "@nestjs/core";
import {ROLES_KEY} from "../decorators/validate-role.decorator";

@Injectable()
export class ValidateRoleGuard implements CanActivate {
  constructor(
      private reflector: Reflector
  ) {}
  canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [context.getHandler(), context.getClass()],);
    const { user } = context.switchToHttp().getRequest();
    if (required.length === 0) return true;
    if (user?.roles.length === 0) throw new ForbiddenException('User has no roles');
    const hasAccess = required.some((r) => user.roles.includes(r));
    if (!hasAccess) throw new ForbiddenException('Acceso prohibido');
    return hasAccess;
  }
}
