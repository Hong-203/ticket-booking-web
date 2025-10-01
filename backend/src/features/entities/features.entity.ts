import { Theatre } from 'src/theatre/entities/theatre.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('features')
export class Feature {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  title: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'image_path' })
  imagePath: string;

  @ManyToOne(() => Theatre, (theatre) => theatre.features, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'theatre_id' })
  theatre: Theatre;
}
