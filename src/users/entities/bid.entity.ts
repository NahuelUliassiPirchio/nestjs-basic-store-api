import { Product } from '../../products/entities/product.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BidItem } from './bidItem.entity';

@Entity()
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz', name: 'initial_date' })
  initialDate: Date;

  @Column({ type: 'timestamptz', name: 'end_date' })
  endDate: Date;

  @OneToMany(() => BidItem, (biditem) => biditem.bid)
  bidders: BidItem[];

  @ManyToOne(() => Product, (product) => product.bids)
  product: Product;
}
