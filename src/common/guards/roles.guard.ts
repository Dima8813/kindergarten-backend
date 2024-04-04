import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../modules/auth/roles-auth.decorator';
import { Role } from '../../modules/role/models/role.model';
import { ConfigService } from '@nestjs/config';
import { AppErrors } from '../consts/errors';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (!requiredRoles) {
        return true;
      }

      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: AppErrors.USER_NOT_AUTHORIZED,
        });
      }

      const user = this.jwtService.verify(token, {
        publicKey: this.configService.get('secret_jwt'),
      });

      req.user = user;
      return user.user.roles.some((role: Role) =>
        requiredRoles.includes(role.value),
      );
    } catch (e) {
      throw new UnauthorizedException({
        message: AppErrors.USER_NOT_AUTHORIZED,
      });
    }
  }
}
