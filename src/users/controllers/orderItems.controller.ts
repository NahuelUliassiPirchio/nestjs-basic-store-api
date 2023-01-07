import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OwnsAuthGuard } from 'src/auth/guards/owns-auth.guard';
import { CreateOrderItemDto, UpdateOrderItemDto } from '../dtos/orderItem.dto';
import { OrderItemsService } from '../services/orderItems.service';

@ApiTags()
@Controller('orders/:id/order-items')
@UseGuards(JwtAuthGuard, OwnsAuthGuard)
export class OrderItemsController {
  constructor(private orderItemsService: OrderItemsService) {}
  @Get()
  getAll(@Param('id', ParseIntPipe) id: number) {
    return this.orderItemsService.getAll(id);
  }

  @Get(':itemId')
  getOrderItem(
    @Param('id') id: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.orderItemsService.getById(itemId, id);
  }

  @Post()
  addOrderItem(
    @Param('id') id: number,
    @Body() orderItemData: CreateOrderItemDto,
  ) {
    return this.orderItemsService.addOrderItem(id, orderItemData);
  }

  @Put(':itemId')
  updateOrderItem(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() updateOrderItemData: UpdateOrderItemDto,
  ) {
    return this.orderItemsService.updateOrderItem(itemId, updateOrderItemData);
  }

  @Delete(':itemId')
  deleteOrderItem(@Param('itemId', ParseIntPipe) itemId: number) {
    return this.orderItemsService.deleteOrderItem(itemId);
  }
}
