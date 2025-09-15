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

  @Post('checkout')
  async checkout(@Request() req) {
    return this.purchaseService.checkout(req.user.sub);
  }

  @Get('orders')
  async getUserOrders(@Request() req) {
    return this.purchaseService.getUserOrders(req.user.sub);
  }
}