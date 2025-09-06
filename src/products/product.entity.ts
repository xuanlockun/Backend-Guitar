import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column('decimal', { precision: 15, scale: 0 })
  price: number;

  @Column('int')
  stock: number;

  @Column({ nullable: true })
  brand: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  category: Category;

  @CreateDateColumn()
  createdAt: Date;
}
