import { Module } from '@nestjs/common'
import { PaymentService } from './payment.service'
import { PaymentController } from './payment.controller'
import { OrderService } from '../order/order.service'
import { PrismaService } from '../prisma.service'

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, OrderService, PrismaService]
})
export class PaymentModule {}
