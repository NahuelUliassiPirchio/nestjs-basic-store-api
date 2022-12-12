import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { OrdersService } from '../services/orders.service';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private ordersService: OrdersService,
  ) {}

  @Get()
  getUsers() {
    return this.usersService.getAll();
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
