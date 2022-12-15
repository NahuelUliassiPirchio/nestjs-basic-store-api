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

  @Column({ type: 'varchar', name: 'initial_date' })
  initialDate: string;

  @Column({ type: 'varchar', name: 'end_date' })
  endDate: string;

  @OneToMany(() => BidItem, (biditem) => biditem.bid)
  bidders: BidItem[];

  @OneToOne(() => Product, (product) => product.bid)
  product: Product;
}
