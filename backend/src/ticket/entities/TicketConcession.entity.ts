import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ticket } from './ticket.entity';
import { ConcessionItem } from 'src/concession-item/entities/concession-item.entity';

@Entity('ticket_concession')
export class TicketConcession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Ticket, (ticket) => ticket.concessions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @ManyToOne(() => ConcessionItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item: ConcessionItem;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_price: number; // price * quantity
}
