import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateOrderDto,
  FilterOrderDto,
  UpdateOrderDto,
} from '../dtos/order.dto';
import { Order } from '../entities/order.entity';
import { UsersService } from './users.service';
import { OrderItemsService } from './orderItems.service';
import { ProductsService } from 'src/products/services/products.service';
import { log } from 'console';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    private usersService: UsersService,
    @Inject(forwardRef(() => OrderItemsService))
    private ordersItemsService: OrderItemsService,
    private productsService: ProductsService,
  ) {}

  getAll(params?: FilterOrderDto) {
    return this.ordersRepository.find({
      relations: { user: true, orderItems: true },
      skip: params?.offset,
      take: params?.limit,
      order: {
        updatedAt: params?.order ? params.order : undefined,
      },
      where: {
        isActive: params?.isActive ? params.isActive === 'true' : undefined,
      },
    });
  }

  getAllByUser(sub: any, params: FilterOrderDto) {
    return this.ordersRepository.find({
      where: {
        user: { id: sub },
        isActive: params?.isActive ? params.isActive === 'true' : undefined,
      },
      relations: { orderItems: { product: true } },
      skip: params?.offset,
      take: params?.limit,
      order: {
        updatedAt: params?.order ? params.order : undefined,
      },
    });
  }

  async getById(id: number) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: { user: true, orderItems: true },
    });
    if (!order) throw new NotFoundException();
    return order;
  }

  async getFromUserId(id: number) {
    const user = await this.usersService.getById(id);
    return user.orders;
  }

  async getFromUserIdById(userId: number, orderId: number) {
    return await this.ordersRepository.find({
      where: {
        user: { id: userId },
        id: orderId,
      },
    });
  }

  async addOrder(data: CreateOrderDto) {
    const activeOrder = await this.ordersRepository.findOne({
      where: { user: { id: data.userId }, isActive: true },
      relations: { orderItems: true },
    });
    if (activeOrder) {
      if (activeOrder.orderItems.length < 1)
        throw new ConflictException('An active order already exists');

      activeOrder.isActive = false;
      await this.ordersRepository.save(activeOrder);
    }

    let newOrder = new Order();
    newOrder.user = await this.usersService.getById(data.userId);

    if (data.initialItems) {
      try {
        await this.productsService.checkProductsExistence(
          data.initialItems.map((orderItem) => orderItem.productId),
        );
        newOrder = await this.ordersRepository.save(newOrder);
        await Promise.all(
          data.initialItems.map(async (orderItem) => {
            await this.ordersItemsService.addOrderItem(newOrder.id, orderItem);
          }),
        );
        return newOrder;
      } catch (error) {
        throw new NotFoundException();
      }
    }

    try {
      return this.ordersRepository.save(newOrder);
    } catch (error) {
      console.log(`error code ${error?.code}`);
      if (error?.code == 23505) throw new ConflictException();
      else throw error;
    }
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
