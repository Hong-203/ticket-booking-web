import { Ticket } from 'src/ticket/entities/ticket.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('barcode')
export class Barcode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'barcode_url',
    nullable: false,
  })
  barcodeUrl: string;

  @Column({ type: 'varchar', length: 50, name: 'code', nullable: false })
  code: string;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'USED', 'EXPIRED'],
    default: 'ACTIVE',
  })
  status: 'ACTIVE' | 'USED' | 'EXPIRED';

  @OneToOne(() => Ticket, (ticket) => ticket.barcode, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
