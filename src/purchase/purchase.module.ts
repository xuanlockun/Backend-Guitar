import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { Order } from '../orders/order.entity';
import { OrderItem } from '../orders/order-item.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, Order, OrderItem, Product, User]),
  ],
  providers: [PurchaseService],
  controllers: [PurchaseController],
})
export class PurchaseModule {}