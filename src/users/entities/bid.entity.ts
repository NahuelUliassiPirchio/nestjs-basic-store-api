import { Product } from '../../products/entities/product.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BidItem } from './bidItem.entity';
import { Expose } from 'class-transformer';

@Entity()
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz', name: 'initial_date' })
  initialDate: Date;

  @Column({ type: 'timestamptz', name: 'end_date' })
  endDate: Date;

  @Expose()
  get isActive(): boolean {
    return this.endDate > new Date();
  }

  @OneToMany(() => BidItem, (biditem) => biditem.bid)
  bidders: BidItem[];

  @Expose()
  get currentPrice(): number {
    if (!this.bidders) return 0;
    const bidItems = this.bidders.map((item) => item.bidAmount);
    return Math.max(...bidItems);
  }

  @ManyToOne(() => Product, (product) => product.bids)
  product: Product;
}
