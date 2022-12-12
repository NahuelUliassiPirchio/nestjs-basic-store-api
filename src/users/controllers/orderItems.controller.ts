import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { OrderItemsService } from '../services/orderItems.service';

@Controller(':order_id/order-items')
export class OrderItemsController {
  constructor(private orderItemsService: OrderItemsService) {}
  @Get()
  getAll(@Param('order_id', ParseIntPipe) orderId: number) {
    return this.orderItemsService.getAllFromOrder(orderId);
  }

  @Get(':order-item_id')
  getOrderItem(
    @Param('order-item_id') orderItemId: number,
    @Param('order_id', ParseIntPipe) orderId: number,
  ) {
    return this.orderItemsService.getByIdFromOrder(orderId, orderItemId);
  }
}
