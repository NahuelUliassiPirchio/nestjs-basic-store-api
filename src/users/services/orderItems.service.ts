import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from '../../products/services/products.service';
import { Repository } from 'typeorm';
import { CreateOrderItemDto, UpdateOrderItemDto } from '../dtos/orderItem.dto';
import { OrderItem } from '../entities/orderItem.entity';
import { OrdersService } from './orders.service';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private productsService: ProductsService,
    @Inject(forwardRef(() => OrdersService))
    private ordersService: OrdersService,
  ) {}

  getAll(orderId: number) {
    return this.orderItemsRepository.find({
      where: { order: { id: orderId } },
      relations: ['product'],
    });
  }

  async getById(id: number, orderId: number) {
    const orderItem = await this.orderItemsRepository.findOne({
      where: { id, order: { id: orderId } },
      relations: { order: true, product: true },
    });
    if (!orderItem) throw new NotFoundException();
    return orderItem;
  }

  async addOrderItem(orderId: number, data: CreateOrderItemDto) {
    const newOrderItem = this.orderItemsRepository.create(data);

    newOrderItem.product = await this.productsService.getById(data.productId);
    if (newOrderItem.product.bids.some((bid) => bid.isActive))
      throw new ConflictException('The product is in a bid');

    newOrderItem.order = await this.ordersService.getById(orderId);

    if (!newOrderItem.order.isActive)
      throw new ConflictException('The order is closed');

    try {
      return await this.orderItemsRepository.save(newOrderItem);
    } catch (error) {
      if (error?.code == 23505) throw new ConflictException();
      else throw error;
    }
  }

  async updateOrderItem(id: number, changes: UpdateOrderItemDto) {
    const orderItem = await this.getById(id, changes.orderId);
    if (changes.productId) {
      const product = await this.productsService.getById(changes.productId);
      if (product.bids.some((bid) => bid.isActive))
        throw new ConflictException('The product is in a bid');

      orderItem.product = product;
    }
    if (changes.orderId) {
      orderItem.order = await this.ordersService.getById(changes.orderId);
      if (!orderItem.order.isActive)
        throw new ConflictException('The order is closed');
    }
    this.orderItemsRepository.merge(orderItem, changes);
    return this.orderItemsRepository.save(orderItem);
  }

  async deleteOrderItem(id: number, orderId: number) {
    const deletedItem = await this.getById(id, orderId);
    if (!deletedItem.order.isActive)
      throw new ConflictException('The order is closed');
    const order = await this.ordersService.getById(orderId);
    order.orderItems = order.orderItems.filter(
      (orderItem) => orderItem.id !== id,
    );
    return this.orderItemsRepository.delete(id);
  }
}
