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
import { BidsService } from './services/bids.service';
import { BidItemsService } from './services/bidItems.service';
import { OrderItemsService } from './services/orderItems.service';
import { BidItemsController } from './controllers/bidItems.controller';
import { OrdersController } from './controllers/orders.controller';

@Module({
  providers: [
    UsersService,
    OrdersService,
    OrderItemsService,
    BidsService,
    BidItemsService,
  ],
  controllers: [
    UsersController,
    BidsController,
    BidItemsController,
    OrderItemsController,
    OrdersController,
  ],
  imports: [
    TypeOrmModule.forFeature([User, Order, OrderItem, Bid, BidItem]),
    ProductsModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
