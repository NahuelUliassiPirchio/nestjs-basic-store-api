import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { OrderItem } from './orderItem.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

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

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  orderItems: OrderItem[];

  @ManyToOne(() => User, (user) => user.orders)
  user: User;
}
