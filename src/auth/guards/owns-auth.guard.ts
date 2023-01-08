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

    const request = context.switchToHttp().getRequest();
    if (request.user.role == UserRole.ADMIN) return true;

    if (hasIdentity) {
      return true;
    }

    const url = request.url;
    const resource = url.includes('orders') ? 'orders' : 'bids';

    const user = await this.usersService.getById(request.user.sub);
    const resourceList = user[resource];
    const ownsOrder = resourceList.some(
      (item: { id: number }) => item.id === parseInt(request.params.id),
    );
    return ownsOrder;
  }
}
