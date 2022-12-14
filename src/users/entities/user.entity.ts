import { UserRole } from '../../common/roles.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Column({ type: 'varchar', length: 255 })
  avatar: string;

  @Column({ type: 'varchar', length: 255, name: 'phone_number' })
  phoneNumber: string;

  @OneToMany(() => Order, (order) => order.user, {
    nullable: true,
  })
  orders: Order[];
}
