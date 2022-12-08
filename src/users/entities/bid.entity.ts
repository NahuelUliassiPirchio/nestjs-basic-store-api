import { Product } from '../../products/entities/product.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'time with time zone', name: 'initial_date' })
  initialDate: Date;

  @Column({ type: 'time with time zone', name: 'end_date' })
  endDate: Date;

  // TODO: bidders (one to many relation) array de tipo de objetos con user, tiempo y plata [nueva entidad]

  @OneToOne(() => Product, (product) => product.bid)
  product: Product;
}
