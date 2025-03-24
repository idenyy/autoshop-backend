import { Injectable } from '@nestjs/common'
import Stripe from 'stripe'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class PaymentService {
  private stripe: Stripe

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-02-24.acacia'
    })
  }

  async createPaymentIntent(amount: number, currency: string = 'usd') {
    return this.stripe.paymentIntents.create({
      amount,
      currency
    })
  }

  async verifyWebhook(payload: any, signature: string) {
    const endpointSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET')
    return this.stripe.webhooks.constructEvent(payload, signature, endpointSecret)
  }
}
