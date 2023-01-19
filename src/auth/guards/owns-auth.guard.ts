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
    let resourceList = [];
    if (resource === 'orders') {
      resourceList = user.orders;
    } else {
      resourceList = user.bids.map((bid) => bid.bid);
    }
    const ownsResource = resourceList.some((item: { id: number }) => {
      return item.id === parseInt(request.params.id);
    });
    return ownsResource;
  }
}
