import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
// import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Order } from './entities/order.entity';
import { ProductsModule } from '../products/products.module';
import { Bid } from './entities/bid.entity';
import { BidItem } from './entities/bidItem.entity';
import { OrderItem } from './entities/orderItem.entity';
import { BidsController } from './controllers/bids.controller';
import { OrderItemsController } from './controllers/orderItems.controller';

@Module({
  providers: [
    UsersService,
    OrdersService,
    BidsController,
    OrderItemsController,
  ],
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([User, Order, OrderItem, Bid, BidItem]),
    ProductsModule,
  ],
})
export class UsersModule {}
