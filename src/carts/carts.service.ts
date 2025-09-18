import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';

@Injectable()
export class CartsService {
    constructor(
        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,
        @InjectRepository(CartItem)
        private readonly cartItemRepository: Repository<CartItem>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }
    async getOrCreateCart(userId: string): Promise<Cart> {
        let cart = await this.cartRepository.findOne({
            where: { user: { id: userId }, isCheckedOut: false },
            relations: ['items', 'items.product'],
        });

        if (!cart) {
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new NotFoundException('User not found');
            }

            cart = this.cartRepository.create({ user, items: [], totalPrice: 0 });
            await this.cartRepository.save(cart);
        }

        return cart;
    }


    async addToCart(userId: string, productId: string, quantity: number): Promise<Cart> {
        const cart = await this.getOrCreateCart(userId);
        const product = await this.productRepository.findOne({ where: { id: productId } });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (product.stock < quantity) {
            throw new BadRequestException('Insufficient stock');
        }

        // Check if product already in cart
        const existingItem = cart.items.find(item => item.product.id === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.price = product.price * existingItem.quantity;
            await this.cartItemRepository.save(existingItem);
        } else {
            const newItem = this.cartItemRepository.create({
                cart,
                product,
                quantity,
                price: product.price * quantity,
            });
            cart.items.push(newItem);
            await this.cartItemRepository.save(newItem);
        }

        // Update total price
        cart.totalPrice = cart.items.reduce((total, item) => total + Number(item.price), 0);
        await this.cartRepository.save(cart);

        return this.getOrCreateCart(userId);
    }

    async updateCartItem(userId: string, itemId: string, quantity: number): Promise<Cart> {
        const cart = await this.getOrCreateCart(userId);
        const item = await this.cartItemRepository.findOne({
            where: { id: itemId, cart: { id: cart.id } },
            relations: ['product'],
        });

        if (!item) {
            throw new NotFoundException('Cart item not found');
        }

        if (!item.product) {
            throw new NotFoundException('Product not found for cart item');
        }

        if (item.product.stock < quantity) {
            throw new BadRequestException('Insufficient stock');
        }

        item.quantity = quantity;
        item.price = item.product.price * quantity;
        await this.cartItemRepository.save(item);

        cart.totalPrice = cart.items.reduce((total, item) => total + Number(item.price), 0);
        await this.cartRepository.save(cart);

        return this.getOrCreateCart(userId);
    }

    async removeFromCart(userId: string, itemId: string): Promise<Cart> {
        const cart = await this.getOrCreateCart(userId);
        const item = await this.cartItemRepository.findOne({
            where: { id: itemId, cart: { id: cart.id } },
        });

        if (!item) {
            throw new NotFoundException('Cart item not found');
        }

        await this.cartItemRepository.remove(item);

        cart.totalPrice = cart.items.reduce((total, item) => total + Number(item.price), 0);
        await this.cartRepository.save(cart);

        return this.getOrCreateCart(userId);
    }

}
