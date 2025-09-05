import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Post()
  create(@Body() body: Partial<Order>): Promise<Order> {
    return this.ordersService.create(body);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: Order['status'],
  ): Promise<Order> {
    return this.ordersService.updateStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.ordersService.remove(id);
  }
}
