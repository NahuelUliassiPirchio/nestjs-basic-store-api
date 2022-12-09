import { Product } from '../../products/entities/product.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BidItem } from './bidItem.entity';

@Entity()
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'time with time zone', name: 'initial_date' })
  initialDate: Date;

  @Column({ type: 'time with time zone', name: 'end_date' })
  endDate: Date;

  @OneToMany(() => BidItem, (biditem) => biditem.bid)
  bidders: BidItem[];

  @OneToOne(() => Product, (product) => product.bid)
  product: Product;
}
