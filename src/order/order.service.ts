import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { OrderDto } from './dto/order.dto'
import { PaymentService } from '../payment/payment.service'
import { OrderStatus } from '@prisma/client'

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private payment: PaymentService
  ) {}

  async create(dto: OrderDto) {
    const paymentIntent = await this.payment.createPaymentIntent(dto.total * 100)

    const order = await this.prisma.order.create({
      data: {
        status: dto.status || OrderStatus.PENDING,
        total: dto.total,
        userId: dto.userId,
        paymentIntentId: paymentIntent.id,
        paymentStatus: paymentIntent.status,
        items: {
          create: dto.items.map((item) => ({
            quantity: item.quantity,
            price: item.price,
            productId: item.productId
          }))
        }
      },
      include: { items: true }
    })

    return order
  }

  async updatePaymentStatus(paymentIntentId: string, status: string) {
    return this.prisma.order.updateMany({
      where: { paymentIntentId },
      data: { paymentStatus: status }
    })
  }
}
