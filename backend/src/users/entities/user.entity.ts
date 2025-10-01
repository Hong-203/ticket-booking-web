import { AccountType, Gender } from 'src/constants';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true, nullable: true })
  email: string;

  @Column({ length: 20, nullable: true })
  full_name: string;

  @Column({ length: 100 })
  password: string;

  @Column({ length: 11, nullable: true })
  phone_number: string;

  @Column({ type: 'int', default: 0 })
  account_balance: number;

  @Column({ type: 'text', nullable: true })
  avatar_url: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ type: 'date', nullable: true })
  dob: Date;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'enum', enum: AccountType, default: AccountType.Customer })
  account_type: AccountType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
