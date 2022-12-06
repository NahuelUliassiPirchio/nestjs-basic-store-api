import { UserRole } from 'src/common/roles.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'int' })
  stock: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Column({ type: 'varchar', length: 255 })
  avatar: string;

  @Column({ type: 'varchar', length: 255, name: 'phone_number' })
  phoneNumber: string;
}
