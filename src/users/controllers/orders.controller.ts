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
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HasIdentity } from '../../auth/decorators/identity.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OwnsAuthGuard } from '../../auth/guards/owns-auth.guard';
import { UserRole } from '../../common/roles.enum';
import {
  CreateOrderDto,
  FilterOrderDto,
  UpdateOrderDto,
} from '../dtos/order.dto';
import { OrdersService } from '../services/orders.service';

@ApiTags('orders')
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('orders')
@UseGuards(JwtAuthGuard, OwnsAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  @HasIdentity()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'List of orders' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'orderBy', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'status', required: false })
  getAll(@Query() params: FilterOrderDto, @Request() req) {
    if (req.user.role === UserRole.ADMIN) {
      return this.ordersService.getAll(params);
    } else if (req.user.sub) {
      return this.ordersService.getAllByUser(req.user.sub, params);
    }
  }

  @Get(':id')
  @ApiResponse({ status: 404, description: 'Not found' })
  getOrder(@Param('id') id: number) {
    return this.ordersService.getById(id);
  }

  @Post()
  @HasIdentity()
  addOrder(@Body() orderData: CreateOrderDto, @Request() req) {
    if (req.user.role === 'ADMIN' || req.user.sub === orderData.userId) {
      const newOrder = this.ordersService.addOrder(orderData);
      return newOrder;
    }
    // return res.status(403).send();
  }

  @Put(':id')
  @ApiResponse({ status: 404, description: 'Not found' })
  updateOrder(
    @Param('id', ParseIntPipe) id: number,
    updateOrderData: UpdateOrderDto,
  ) {
    return this.ordersService.updateOrder(id, updateOrderData);
  }

  @Delete(':id')
  @ApiResponse({ status: 404, description: 'Not found' })
  deleteOrder(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.deleteOrder(id);
  }

  @Get(':id/items')
  @ApiResponse({ status: 404, description: 'Not found' })
  getOrderItems(@Param('id', ParseIntPipe) id: number) {
    return this.getOrderItems(id);
  }

  @Put(':id/items/:order-item-id')
  @ApiResponse({ status: 404, description: 'Not found' })
  addItemToOrder(
    @Param('id', ParseIntPipe) id: number,
    @Param('order-item-id', ParseIntPipe) orderItemId: number,
  ) {
    return this.addItemToOrder(id, orderItemId);
  }

  @Delete(':id/items/:order-item-id')
  @ApiResponse({ status: 404, description: 'Not found' })
  deleteItemFromOrder(
    @Param('id', ParseIntPipe) id: number,
    @Param('order-item-id', ParseIntPipe) orderItemId: number,
  ) {
    return this.deleteItemFromOrder(id, orderItemId);
  }
}
