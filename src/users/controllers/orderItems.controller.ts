import { Controller, Get, Param } from '@nestjs/common';
import { OrderItemsService } from '../services/orderItems.service';

@Controller(':order_id/order-items')
export class OrderItemsController {
  constructor(private orderItemsService: OrderItemsService) {}
  @Get()
  getAll() {
    return this.orderItemsService.getAll();
  }

  @Get(':id')
  getOrderItem(@Param('id') id: number) {
    return this.orderItemsService.getById(id);
  }
}
