import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'time with time zone', name: 'initial_date' })
  initialDate: Date;

  @Column({ type: 'time with time zone', name: 'end_date' })
  endDate: Date;

  // bidders (one to many relation)

  // product (one to one relation)
}
