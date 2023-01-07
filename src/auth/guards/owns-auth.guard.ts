import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/common/roles.enum';
import { UsersService } from 'src/users/services/users.service';
import { HAS_IDENTITY_KEY } from '../decorators/identity.decorator';

@Injectable()
export class OwnsAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const hasIdentity = this.reflector.getAllAndOverride<boolean>(
      HAS_IDENTITY_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (hasIdentity) return true;

    const request = context.switchToHttp().getRequest();
    if (request.user.role == UserRole.ADMIN) return true;

    const user = await this.usersService.getById(request.user.sub);
    const orders = user.orders;
    const ownsOrder = orders.some(
      (order) => order.id === parseInt(request.params.id),
    );
    return ownsOrder;
  }
}
