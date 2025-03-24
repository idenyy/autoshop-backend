import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { SupplierModule } from './supplier/supplier.module'
import { OrderModule } from './order/order.module'
import { ReviewModule } from './review/review.module'
import { ProductModule } from './product/product.module'
import { StatisticsModule } from './statistics/statistics.module'
import { PaymentModule } from './payment/payment.module'
import { CategoryModule } from './category/category.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    SupplierModule,
    OrderModule,
    ReviewModule,
    CategoryModule,
    ProductModule,
    StatisticsModule,
    PaymentModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
