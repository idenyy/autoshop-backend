import { Controller, Post, Body, Req, Headers } from '@nestjs/common'
import { PaymentService } from './payment.service'
import { OrderService } from '../order/order.service'

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private orderService: OrderService
  ) {}

  @Post('intent')
  async createPaymentIntent(@Body('amount') amount: number) {
    return this.paymentService.createPaymentIntent(amount)
  }

  @Post('webhook')
  async handleWebhook(@Req() req: any, @Headers('stripe-signature') signature: string) {
    const event = await this.paymentService.verifyWebhook(req.rawBody, signature)

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object
      await this.orderService.updatePaymentStatus(paymentIntent.id, 'succeeded')
    }

    return { received: true }
  }
}
