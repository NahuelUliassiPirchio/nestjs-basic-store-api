import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto, UpdateOrderDto } from '../dtos/order.dto';
import { Order } from '../entities/order.entity';
import { UsersService } from './users.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    private usersService: UsersService,
  ) {}

  getAll() {
    return this.ordersRepository.find();
  }

  async getById(id: number) {
    const order = await this.ordersRepository.findOneBy({ id });
    if (!order) throw new NotFoundException();
    return order;
  }

  async getFromUserId(id: number) {
    const user = await this.usersService.getById(id);
    return this.ordersRepository.find({ where: { user } });
  }

  async getFromUserIdById(userId: number, orderId: number) {
    const user = await this.usersService.getById(userId);
    return this.ordersRepository.find({
      where: {
        user,
        id: orderId,
      },
    });
  }

  async addOrder(data: CreateOrderDto) {
    const newOrder = new Order();
    newOrder.user = await this.usersService.getById(data.userId);
    //if(data.itemsIds)
    return this.ordersRepository.save(newOrder);
  }

  async updateOrder(id: number, changes: UpdateOrderDto) {
    const order = await this.getById(id);
    if (changes.userId) {
      order.user = await this.usersService.getById(changes.userId);
    }
    return this.ordersRepository.save(order);
  }

  async deleteOrder(id: number) {
    await this.getById(id);
    return this.ordersRepository.delete(id);
  }
}
