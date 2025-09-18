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
import { CartsService } from './carts.service';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartService: CartsService) { }
  @UseGuards(AuthGuard)
  @Get()
  async getCart(@Request() req) {
    return this.cartService.getOrCreateCart(req.user.sub);
  }

  // @Post('cart/add')
  // async addToCart(
  //   @Request() req,
  //   @Body() body: { productId: string; quantity: number },
  // ) {
  //   return this.cartService.addToCart(req.user.sub, body.productId, body.quantity);
  // }

  @UseGuards(AuthGuard)
  @Put(':itemId')
  async updateCartItem(
    @Request() req,
    @Param('itemId') itemId: string,
    @Body() body: { quantity: number },
  ) {
    return this.cartService.updateCartItem(req.user.sub, itemId, body.quantity);
  }

  @UseGuards(AuthGuard)
  @Delete(':itemId')
  async removeFromCart(@Request() req, @Param('itemId') itemId: string) {
    return this.cartService.removeFromCart(req.user.sub, itemId);
  }
}
