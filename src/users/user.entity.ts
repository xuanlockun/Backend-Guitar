import { Address } from '../address/address.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @CreateDateColumn()
  createdAt: Date;
  
  @OneToMany(() => Address, address => address.user)
  addresses: Address[];
}