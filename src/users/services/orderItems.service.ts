import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderItemDto, UpdateOrderItemDto } from '../dtos/orderItem.dto';
import { OrderItem } from '../entities/orderItem.entity';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
  ) {}

  getAll() {
    return this.orderItemsRepository.find();
  }

  async getById(id: number) {
    const orderItem = await this.orderItemsRepository.findOneBy({ id });
    if (!orderItem) throw new NotFoundException();
    return orderItem;
  }

  async addOrderItem(data: CreateOrderItemDto) {
    const newOrderItem = this.orderItemsRepository.create(data);
    return this.orderItemsRepository.save(newOrderItem);
  }

  async updateOrderItem(id: number, changes: UpdateOrderItemDto) {
    const orderItem = await this.getById(id);
    this.orderItemsRepository.merge(orderItem, changes);
    return this.orderItemsRepository.save(orderItem);
  }

  async deleteOrderItem(id: number) {
    await this.getById(id);
    return this.orderItemsRepository.delete(id);
  }
}
