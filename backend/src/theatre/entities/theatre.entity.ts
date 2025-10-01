import { Feature } from 'src/features/entities/features.entity';
import { Hall } from 'src/hall/entities/hall.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('theatre')
export class Theatre {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 100, name: 'slug_name', nullable: true })
  slug_name: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  location: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'slug_location',
    nullable: true,
  })
  slug_location: string;

  @Column({
    type: 'varchar',
    length: 250,
    nullable: true,
    name: 'location_details',
  })
  locationDetails: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // relation
  @OneToMany(() => Feature, (feature) => feature.theatre)
  features: Feature[];

  @OneToMany(() => Hall, (hall) => hall.theatre)
  halls: Hall[];
}
