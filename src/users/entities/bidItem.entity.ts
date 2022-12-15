import { Bid } from './bid.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class BidItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'bid_amount' })
  bidAmount: number;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt: Date;

  @ManyToOne(() => Bid, (bid) => bid.bidders)
  bid: Bid;

  @ManyToOne(() => User, (user) => user.bids)
  user: User;
}
