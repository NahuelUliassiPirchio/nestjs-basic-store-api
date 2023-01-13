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
import { Transform } from 'class-transformer';

@Entity()
export class BidItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'bid_amount' })
  bidAmount: number;

  @Column({ type: 'boolean', name: 'is_anonymous', default: true })
  isAnonymous: boolean;

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

  @Transform(({ value }) => (value.isAnonymous ? value : null))
  @ManyToOne(() => User, (user) => user.bids)
  user: User;
}
