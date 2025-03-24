import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { OrderService } from './order.service'
import { OrderDto } from './dto/order.dto'

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() dto: OrderDto) {
    return this.orderService.create(dto)
  }

  // @Get(':id')
  // async getOrder(@Param('id') id: string) {
  //   return this.orderService.getOrderById(id)
  // }
}
