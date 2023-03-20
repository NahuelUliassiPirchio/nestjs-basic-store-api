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
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/role.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../../common/roles.enum';
import { CreateUserDto, FilterUserDto, UpdateUserDto } from '../dtos/user.dto';
import { OrdersService } from '../services/orders.service';
import { UsersService } from '../services/users.service';

@ApiTags('users')
@Controller('users')
@Roles(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private ordersService: OrdersService,
  ) {}

  @Get()
  @ApiResponse({ status: 200, description: 'List of users' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'role', required: false })
  @ApiQuery({ name: 'q', required: false })
  getUsers(@Query() params: FilterUserDto) {
    return this.usersService.getAll(params);
  }

  @Get(':id')
  @ApiResponse({ status: 404, description: 'User not found' })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getById(id);
  }

  @Post()
  @ApiResponse({ status: 419, description: 'User already exists' })
  addUser(@Body() data: CreateUserDto) {
    return this.usersService.addUser(data);
  }

  @Put(':id')
  @ApiResponse({ status: 404, description: 'User not found' })
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserData: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserData);
  }

  @Delete(':id')
  @ApiResponse({ status: 404, description: 'User not found' })
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }

  @Get(':id/orders')
  @ApiResponse({ status: 404, description: 'User not found' })
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
