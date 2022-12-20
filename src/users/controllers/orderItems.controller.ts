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
import { ApiTags } from '@nestjs/swagger';
import { CreateOrderItemDto, UpdateOrderItemDto } from '../dtos/orderItem.dto';
import { OrderItemsService } from '../services/orderItems.service';

@ApiTags('order-items')
@Controller('order-items')
export class OrderItemsController {
  constructor(private orderItemsService: OrderItemsService) {}
  @Get()
  getAll() {
    return this.orderItemsService.getAll();
  }

  @Get(':id')
  getOrderItem(@Param('id', ParseIntPipe) id: number) {
    return this.orderItemsService.getById(id);
  }

  @Post()
  addOrderItem(@Body() orderItemData: CreateOrderItemDto) {
    return this.orderItemsService.addOrderItem(orderItemData);
  }

  @Put(':id')
  updateOrderItem(
    @Param('id', ParseIntPipe) id,
    @Body() updateOrderItemData: UpdateOrderItemDto,
  ) {
    return this.orderItemsService.updateOrderItem(id, updateOrderItemData);
  }

  @Delete(':id')
  deleteOrderItem(@Param('id', ParseIntPipe) id: number) {
    return this.orderItemsService.deleteOrderItem(id);
  }
}
