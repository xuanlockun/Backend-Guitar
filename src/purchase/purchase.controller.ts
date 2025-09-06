import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { PurchaseService } from './purchase.service';

@Controller('purchase')
@UseGuards(AuthGuard)
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Get('cart')
  async getCart(@Request() req) {
    return this.purchaseService.getOrCreateCart(req.user.sub);
  }

  @Post('cart/add')
  async addToCart(
    @Request() req,
    @Body() body: { productId: string; quantity: number },
  ) {
    return this.purchaseService.addToCart(req.user.sub, body.productId, body.quantity);
  }

  @Put('cart/:itemId')
  async updateCartItem(
    @Request() req,
    @Param('itemId') itemId: string,
    @Body() body: { quantity: number },
  ) {
    return this.purchaseService.updateCartItem(req.user.sub, itemId, body.quantity);
  }

  @Delete('cart/:itemId')
  async removeFromCart(@Request() req, @Param('itemId') itemId: string) {
    return this.purchaseService.removeFromCart(req.user.sub, itemId);
  }

  @Post('checkout')
  async checkout(@Request() req) {
    return this.purchaseService.checkout(req.user.sub);
  }

  @Get('orders')
  async getUserOrders(@Request() req) {
    return this.purchaseService.getUserOrders(req.user.sub);
  }
}