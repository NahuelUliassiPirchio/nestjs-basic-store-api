import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/common/roles.enum';
import { CreateUserDto, FilterUserDto, UpdateUserDto } from '../dtos/user.dto';
import { OrdersService } from '../services/orders.service';
import { UsersService } from '../services/users.service';

@Controller('users')
@Roles(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private ordersService: OrdersService,
  ) {}

  @Get()
  getUsers(@Query() params: FilterUserDto) {
    return this.usersService.getAll(params);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getById(id);
  }

  @Post()
  addUser(@Body() data: CreateUserDto) {
    return this.usersService.addUser(data);
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserData: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserData);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }

  @Get(':id/orders')
  getUserOrders(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.getFromUserId(id);
  }

  @Get(':userId/orders/:orderId')
  getUserOrderById(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    return this.ordersService.getFromUserIdById(userId, orderId);
  }
}
