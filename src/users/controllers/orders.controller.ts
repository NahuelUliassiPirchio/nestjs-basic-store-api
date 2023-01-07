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
  Response,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HasIdentity } from 'src/auth/decorators/identity.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OwnsAuthGuard } from 'src/auth/guards/owns-auth.guard';
import { UserRole } from 'src/common/roles.enum';
import {
  CreateOrderDto,
  FilterOrderDto,
  UpdateOrderDto,
} from '../dtos/order.dto';
import { OrdersService } from '../services/orders.service';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard, OwnsAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}
  @Get()
  @HasIdentity()
  getAll(@Query() params: FilterOrderDto, @Request() req) {
    if (req.user.role === UserRole.ADMIN) {
      return this.ordersService.getAll(params);
    } else {
      return this.ordersService.getAllByUser(req.user.sub, params);
    }
  }

  @Get(':id')
  getOrder(@Param('id') id: number) {
    return this.ordersService.getById(id);
  }

  @Post()
  @HasIdentity()
  addOrder(@Body() orderData: CreateOrderDto, @Request() req, @Response() res) {
    if (req.user.role === 'ADMIN' || req.user.sub === orderData.userId) {
      return this.ordersService.addOrder(orderData);
    }
    return res.status(403).send();
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
