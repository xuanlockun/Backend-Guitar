import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.addresses)
  user: User;

  @Column()
  name: string;
  
  @Column()
  province: string;
  
  @Column()
  district: string;
  
  @Column()
  ward: string;
  
  @Column()
  street: string;
  
  @CreateDateColumn()
  createdAt: Date;
}