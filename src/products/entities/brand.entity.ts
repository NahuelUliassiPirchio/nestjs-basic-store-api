import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BrandEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  image: string;
}