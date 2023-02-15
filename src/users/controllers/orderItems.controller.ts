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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OwnsAuthGuard } from '../../auth/guards/owns-auth.guard';
import { CreateOrderItemDto, UpdateOrderItemDto } from '../dtos/orderItem.dto';
import { OrderItemsService } from '../services/orderItems.service';

@ApiTags('orders/:id/order-items')
@ApiBearerAuth()
@Controller('orders/:id/order-items')
@UseGuards(JwtAuthGuard, OwnsAuthGuard)
export class OrderItemsController {
  constructor(private orderItemsService: OrderItemsService) {}

  @ApiResponse({ status: 200, description: 'Get all order items' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  getAll(@Param('id', ParseIntPipe) id: number) {
    return this.orderItemsService.getAll(id);
  }

  @Get(':itemId')
  @ApiResponse({ status: 200, description: 'Get order item' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Order item not found' })
  getOrderItem(
    @Param('id') id: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.orderItemsService.getById(itemId, id);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Order item created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  addOrderItem(
    @Param('id') id: number,
    @Body() orderItemData: CreateOrderItemDto,
  ) {
    return this.orderItemsService.addOrderItem(id, orderItemData);
  }

  @Put(':itemId')
  @ApiResponse({ status: 200, description: 'Order item updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Order item not found' })
  updateOrderItem(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() updateOrderItemData: UpdateOrderItemDto,
  ) {
    return this.orderItemsService.updateOrderItem(itemId, updateOrderItemData);
  }

  @Delete(':itemId')
  @ApiResponse({ status: 200, description: 'Order item deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Order item not found' })
  deleteOrderItem(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Param('id') id: number,
  ) {
    return this.orderItemsService.deleteOrderItem(itemId, id);
  }
}
