import { SeatStatus } from 'src/constants';
import { Hall } from 'src/hall/entities/hall.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';

@Entity('seat')
export class Seat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'char', length: 3, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: SeatStatus,
    default: SeatStatus.Empty,
  })
  status: SeatStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // relation
  // @OneToMany(() => HallwiseSeat, (hallwiseSeat) => hallwiseSeat.seat)
  // hallwiseSeats: HallwiseSeat[];

  @ManyToMany(() => Hall, (hall) => hall.seats)
  halls: Hall[];
}
