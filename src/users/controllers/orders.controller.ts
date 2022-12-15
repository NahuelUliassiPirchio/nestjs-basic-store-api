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
import { CreateOrderDto, UpdateOrderDto } from '../dtos/order.dto';
import { OrdersService } from '../services/orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}
  @Get()
  getAll() {
    return this.ordersService.getAll();
  }

  @Get(':id')
  getOrder(@Param('id') id: number) {
    return this.ordersService.getById(id);
  }

  @Post()
  addOrder(@Body() orderData: CreateOrderDto) {
    return this.ordersService.addOrder(orderData);
  }

  @Put(':id')
  updateOrder(
    @Param('id', ParseIntPipe) id: number,
    updateOrderData: UpdateOrderDto,
  ) {
    return this.ordersService.updateOrder(id, updateOrderData);
  }

  @Get(':id/items')
  getOrderItems(@Param('id', ParseIntPipe) id: number) {
    return this.getOrderItems(id);
  }

  @Put(':id/items/:order-item-id')
  addItemToOrder(
    @Param('id', ParseIntPipe) id: number,
    @Param('order-item-id', ParseIntPipe) orderItemId: number,
  ) {
    return this.addItemToOrder(id, orderItemId);
  }

  @Delete(':id/items/:order-item-id')
  deleteItemFromOrder(
    @Param('id', ParseIntPipe) id: number,
    @Param('order-item-id', ParseIntPipe) orderItemId: number,
  ) {
    return this.deleteItemFromOrder(id, orderItemId);
  }
}
